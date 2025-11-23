export default function FileUploadModal({ open, onFile, close }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow space-y-4">
        <h2 className="text-lg font-semibold">Upload CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            onFile(e.target.files[0]);
            close();
          }}
          className="w-full"
        />
        <button onClick={close} className="w-full py-2 bg-gray-300 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
