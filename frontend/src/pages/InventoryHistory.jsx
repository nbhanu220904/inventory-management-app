export default function InventoryHistory({ history }) {
  if (!history.length)
    return <p className="text-sm text-gray-500">No history found</p>;

  return (
    <ul className="space-y-3">
      {history.map((h) => (
        <li key={h.id} className="border-b pb-2">
          <p className="font-semibold">
            {h.old_quantity} → {h.new_quantity}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(h.change_date).toLocaleString()}
          </p>
          {h.user_info && <p className="text-xs italic">{h.user_info}</p>}
        </li>
      ))}
    </ul>
  );
}
