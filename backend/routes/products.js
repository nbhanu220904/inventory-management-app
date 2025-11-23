const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const upload = multer({ dest: "uploads/" });

// Helpers to use sqlite3 with Promises
const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

// GET /api/products  (with optional search, category, pagination, sorting)
router.get("/", async (req, res) => {
  try {
    const { page, limit, sort, order, category, name } = req.query;

    const whereClauses = [];
    const params = [];

    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }

    if (name) {
      whereClauses.push("name LIKE ?");
      params.push(`%${name}%`);
    }

    let query = "SELECT * FROM products";
    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    const validSortFields = ["name", "category", "brand", "stock", "id"];
    const sortField = validSortFields.includes(sort) ? sort : "id";
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    let finalQuery = query;
    if (page && limit) {
      const p = parseInt(page, 10) || 1;
      const l = parseInt(limit, 10) || 10;
      const offset = (p - 1) * l;
      finalQuery += ` LIMIT ${l} OFFSET ${offset}`;
    }

    const products = await dbAll(finalQuery, params);
    res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products  (Add new product)
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, unit, category, brand, stock, image } = req.body;
      const status = Number(stock) === 0 ? "Out of Stock" : "In Stock";

      const existing = await dbGet("SELECT id FROM products WHERE name = ?", [
        name,
      ]);
      if (existing) {
        return res.status(400).json({ error: "Product name must be unique" });
      }

      const result = await dbRun(
        `INSERT INTO products (name, unit, category, brand, stock, status, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          unit || "",
          category || "",
          brand || "",
          Number(stock),
          status,
          image || "",
        ]
      );

      const newProduct = await dbGet("SELECT * FROM products WHERE id = ?", [
        result.lastID,
      ]);
      res.status(201).json(newProduct);
    } catch (err) {
      console.error("POST /products error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PUT /api/products/:id  (Update product + history)
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  async (req, res) => {
    const { id } = req.params;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, unit, category, brand, stock, image, user_info } = req.body;
      const numericStock = Number(stock);
      const status = numericStock === 0 ? "Out of Stock" : "In Stock";

      const product = await dbGet("SELECT * FROM products WHERE id = ?", [id]);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const duplicate = await dbGet(
        "SELECT id FROM products WHERE name = ? AND id != ?",
        [name, id]
      );
      if (duplicate) {
        return res.status(400).json({ error: "Product name must be unique" });
      }

      // Insert history if stock changed
      if (product.stock !== numericStock) {
        await dbRun(
          `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
           VALUES (?, ?, ?, ?, ?)`,
          [
            id,
            product.stock,
            numericStock,
            new Date().toISOString(),
            user_info || "",
          ]
        );
      }

      await dbRun(
        `UPDATE products
         SET name = ?, unit = ?, category = ?, brand = ?, stock = ?, status = ?, image = ?
         WHERE id = ?`,
        [
          name,
          unit || "",
          category || "",
          brand || "",
          numericStock,
          status,
          image || "",
          id,
        ]
      );

      const updated = await dbGet("SELECT * FROM products WHERE id = ?", [id]);
      res.json(updated);
    } catch (err) {
      console.error("PUT /products/:id error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbGet("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await dbRun("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:id/history
router.get("/:id/history", async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await dbAll(
      `SELECT * FROM inventory_history
       WHERE product_id = ?
       ORDER BY change_date DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /products/:id/history error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products/import
router.post("/import", upload.single("csvFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const filePath = req.file.path;
  const rows = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    let added = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = row.name || row.Name;
      if (!name) {
        skipped++;
        continue;
      }

      const unit = row.unit || row.Unit || "";
      const category = row.category || row.Category || "";
      const brand = row.brand || row.Brand || "";
      const stock = Number(row.stock || row.Stock || 0);
      const image = row.image || row.Image || "";
      const status = stock === 0 ? "Out of Stock" : "In Stock";

      const existing = await dbGet("SELECT id FROM products WHERE name = ?", [
        name,
      ]);
      if (existing) {
        skipped++;
        continue;
      }

      await dbRun(
        `INSERT INTO products (name, unit, category, brand, stock, status, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, unit, category, brand, stock, status, image]
      );
      added++;
    }

    fs.unlink(filePath, () => {});
    res.json({ added, skipped });
  } catch (err) {
    console.error("POST /products/import error:", err);
    fs.unlink(filePath, () => {});
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/export
router.get("/export", async (req, res) => {
  try {
    const rows = await dbAll("SELECT * FROM products ORDER BY id ASC");

    const headers = [
      "id",
      "name",
      "unit",
      "category",
      "brand",
      "stock",
      "status",
      "image",
    ];

    const escapeVal = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [];
    csvLines.push(headers.join(","));

    for (const row of rows) {
      const line = headers.map((h) => escapeVal(row[h])).join(",");
      csvLines.push(line);
    }

    const csvData = csvLines.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products.csv"');
    res.status(200).send(csvData);
  } catch (err) {
    console.error("GET /products/export error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
