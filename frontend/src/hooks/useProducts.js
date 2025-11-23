import { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/api/products", { params });
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (data) => {
    const res = await api.post("/api/products", data);
    setProducts((prev) => [...prev, res.data]);
  };

  // Update product
  const updateProduct = async (id, data) => {
    const res = await api.put(`/api/products/${id}`, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  // Delete product
  const deleteProduct = async (id) => {
    await api.delete(`/api/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Auto fetch on first mount
  useEffect(() => {
    fetchProducts();
    // ⚠ Important: return nothing here to avoid "destroy is not a function"
    return undefined;
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
