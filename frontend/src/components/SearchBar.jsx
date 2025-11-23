export default function SearchBar({ search, setSearch, onSearch }) {
  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        onSearch();
      }}
      placeholder="Search..."
      className="border px-3 py-2 rounded w-full"
    />
  );
}
