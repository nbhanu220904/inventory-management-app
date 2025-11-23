import { useState } from "react";

export default function ProductRow({
  product,
  onUpdateProduct,
  onDeleteProduct,
  onSelectProduct,
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...product, user_info: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const save = () => {
    onUpdateProduct(product.id, { ...form, stock: Number(form.stock) });
    setEditing(false);
  };

  return (
    <tr className="hover:bg-orange-50 transition border border-gray-300">
      {/* Editable product fields */}
      {["name", "unit", "category", "brand", "stock"].map((key) => (
        <td
          key={key}
          className="px-4 py-3 whitespace-nowrap border border-gray-300"
        >
          {editing ? (
            <input
              className="border rounded px-2 py-1 w-full outline-none focus:ring-2 focus:ring-orange-400"
              name={key}
              value={form[key]}
              type={key === "stock" ? "number" : "text"}
              onChange={handleChange}
            />
          ) : (
            <span className="text-gray-800">{product[key]}</span>
          )}
        </td>
      ))}

      {/* Status */}
      <td className="px-4 py-3 border border-gray-300">
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            product.stock === 0
              ? "bg-red-600 text-red-600"
              : "bg-green-600 text-white"
          }`}
        >
          {product.stock === 0 ? "Out of Stock" : "In Stock"}
        </span>
      </td>

      {/* Image */}
      <td className="px-4 py-3 border border-gray-300">
        {editing ? (
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full outline-none focus:ring-2 focus:ring-orange-400"
          />
        ) : product.image ? (
          <a
            href={product.image}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            View
          </a>
        ) : (
          <span className="text-gray-500">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 border border-gray-300">
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={save}
              className="px-3 py-1 bg-green-600 cursor-pointer text-white text-xs rounded-full hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 bg-gray-500 cursor-pointer text-white text-xs rounded-full hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 cursor-pointer bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteProduct(product.id)}
              className="px-3 py-1 cursor-pointer bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={() => onSelectProduct(product)}
              className="px-3 py-1 cursor-pointer bg-yellow-400 text-black text-xs rounded-full hover:bg-yellow-500 transition"
            >
              History
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
