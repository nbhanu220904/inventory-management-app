import { useState, useEffect } from "react";
import useProducts from "./hooks/useProducts";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import ProductTable from "./components/ProductTable";
import HistorySidebar from "./components/HistorySidebar";
import AddProduct from "./pages/AddProduct";
import ImportExport from "./pages/ImportExport";

export default function App() {
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  //   useEffect(() => fetchProducts(), []);
  useEffect(() => {
    async function load() {
      await fetchProducts();
    }
    load();
  }, []);

  const filtered = () =>
    fetchProducts({
      name: search || undefined,
      category: category || undefined,
    });

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        openAdd={() => setShowAdd(true)}
        openImport={() => setShowImport(true)}
      />

      <div className="p-6 flex gap-3">
        <SearchBar search={search} setSearch={setSearch} onSearch={filtered} />
        <CategoryFilter
          categories={[...new Set(products.map((p) => p.category))]}
          selected={category}
          setSelected={setCategory}
          onFilter={filtered}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
      ) : (
        <ProductTable
          products={products}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
          onSelectProduct={setSelectedProduct}
        />
      )}

      {selectedProduct && (
        <HistorySidebar
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showAdd && (
        <AddProduct close={() => setShowAdd(false)} onSave={addProduct} />
      )}
      {showImport && <ImportExport close={() => setShowImport(false)} />}
    </div>
  );
}
