import { useState } from "react";

export default function AddProduct({ close, onSave }) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Product name is required");
    await onSave({ ...form, stock: Number(form.stock || 0) });
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-semibold">Add New Product</h2>

        {["name", "unit", "category", "brand", "stock", "image"].map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key.toUpperCase()}
            type={key === "stock" ? "number" : "text"}
            value={form[key]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        ))}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
