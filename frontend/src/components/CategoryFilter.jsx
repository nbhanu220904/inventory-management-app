export default function CategoryFilter({
  categories,
  selected,
  setSelected,
  onFilter,
}) {
  return (
    <select
      value={selected}
      onChange={(e) => {
        setSelected(e.target.value);
        onFilter();
      }}
      className="border px-3 py-2 rounded"
    >
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
