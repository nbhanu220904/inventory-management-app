import InventoryHistory from "../pages/InventoryHistory";

export default function HistorySidebar({ product, history, onClose }) {
  if (!product) return null;

  return (
    <aside className="fixed right-0 top-0 w-80 h-full bg-gray-100 shadow-lg p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">History — {product.name}</h3>
        <button onClick={onClose} className="text-red-600 font-bold text-xl">
          ×
        </button>
      </div>
      <InventoryHistory history={history} />
    </aside>
  );
}
