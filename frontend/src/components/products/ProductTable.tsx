import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { productApi } from "@/services/api";

interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ProductTableProps {
  onEdit?: (product: Product) => void;
}

export const ProductTable = ({ onEdit }: ProductTableProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [productData, setProductData] = useState<{ data: Product[]; meta?: Meta }>({
    data: [],
    meta: undefined,
  });
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll({ page, limit });
      // API returns { data: Product[], meta: Meta }
      if (res && Array.isArray(res.data)) {
        setProductData({ data: res.data, meta: res.meta });
      } else {
        setProductData({ data: [], meta: undefined });
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProductData({ data: [], meta: undefined });
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productList = productData.data || [];
  const meta = productData.meta;

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10)
      return (
        <Badge variant="secondary" className="bg-warning text-warning-foreground">
          Low Stock ({stock})
        </Badge>
      );
    return (
      <Badge variant="default" className="bg-success text-success-foreground">
        In Stock ({stock})
      </Badge>
    );
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(price);

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "-";
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate numeric page buttons
  const pageNumbers = meta ? Array.from({ length: meta.pages }, (_, i) => i + 1) : [];

  return (
    <div>
      {/* Controls for page & limit */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="mr-2">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 border rounded ${
                num === page ? "bg-blue-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center p-4">Loading products...</div>
        ) : productList.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No products found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Discount Amount
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Price After Discount
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {product.discount_type === "percentage"
                      ? `${product.discount_amount}%`
                      : formatPrice(product.discount_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(product.payable_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.available_stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(product.available_stock)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(product)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination info */}
      {meta && (
        <div className="mt-2 text-sm text-gray-500">
          Showing page {meta.page} of {meta.pages} — Total items: {meta.total}
        </div>
      )}
    </div>
  );
};
