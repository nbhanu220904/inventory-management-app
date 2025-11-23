import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductTable from "../components/ProductTable";

export default function Dashboard({
  products,
  search,
  setSearch,
  category,
  setCategory,
  fetchFiltered,
  updateProduct,
  deleteProduct,
  selectProduct,
  loading,
}) {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-6">
      <div className="flex gap-3 mb-5">
        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={fetchFiltered}
        />
        <CategoryFilter
          categories={categories}
          selected={category}
          setSelected={setCategory}
          onFilter={fetchFiltered}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <ProductTable
          products={products}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onSelectProduct={selectProduct}
        />
      )}
    </div>
  );
}
