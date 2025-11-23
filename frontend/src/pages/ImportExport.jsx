import { api } from "../utils/api";

export default function ImportExport({ close }) {
  const handleExport = () => {
    window.open(`${api.defaults.baseURL}/api/products/export`, "_blank");
  };

  const handleImport = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("csvFile", file);

    const res = await api.post("/api/products/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert(`Imported — Added: ${res.data.added}, Skipped: ${res.data.skipped}`);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow">
        <h2 className="text-xl font-semibold">Import / Export Products</h2>

        <button
          onClick={handleExport}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Export Products CSV
        </button>

        <label className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded text-center block">
          Import Products CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        <button onClick={close} className="w-full bg-gray-300 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
