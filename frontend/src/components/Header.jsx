export default function Header({ openAdd, openImport }) {
  return (
    <header className="flex justify-between items-center bg-orange-500 px-6 py-4 text-white shadow">
      <h1 className="text-xl font-semibold">Inventory Management</h1>
      <div className="flex gap-3">
        <button
          onClick={openAdd}
          className="bg-white text-orange-600 px-4 py-2 rounded shadow"
        >
          + Add Product
        </button>
        <button
          onClick={openImport}
          className="bg-white text-orange-600 px-4 py-2 rounded shadow"
        >
          Import / Export
        </button>
      </div>
    </header>
  );
}
