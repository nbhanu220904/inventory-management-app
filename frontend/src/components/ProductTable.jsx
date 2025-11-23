import ProductRow from "./ProductRow";

export default function ProductTable({ products, ...props }) {
  return (
    <div className="rounded border shadow overflow-auto mt-6 mx-4">
      <table className="w-full text-sm table-fixed border-collapse">
        <thead>
          <tr className="bg-orange-300 text-gray-800">
            {[
              "Name",
              "Unit",
              "Category",
              "Brand",
              "Stock",
              "Status",
              "Image",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-semibold border border-orange-400 text-left whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="text-center py-6 text-gray-500 font-medium border"
              >
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <ProductRow key={p.id} product={p} {...props} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
