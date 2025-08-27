import { useState, useEffect, useCallback, useMemo } from "react";
import { Inventory, Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { inventoryApi, productApi } from "@/services/api";
import { Meta } from "@/types";

interface InventoryTableProps {
  onEdit?: (item: Inventory) => void;
  onDelete?: (item: Inventory) => void;
}

export const InventoryTable = ({ onEdit, onDelete }: InventoryTableProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [inventoryData, setInventoryData] = useState<{ data: Inventory[]; meta?: Meta }>({
    data: [],
    meta: undefined,
  });
  const [loading, setLoading] = useState(false);

  // Fetch inventory
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll({ page, limit });
      // API returns { data: Inventory[], meta: Meta }
      if (res && Array.isArray(res.data)) {
        setInventoryData({ data: res.data, meta: res.meta });
      } else {
        setInventoryData({ data: [], meta: undefined });
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
      setInventoryData({ data: [], meta: undefined });
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const inventoryList = inventoryData.data || [];
  const meta = inventoryData.meta;

  // Fetch products separately (assuming you need this for product names)
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll({ page: 1, limit: 1000 });
        if (res && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Create product map for quick lookup
  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "BDT",
      minimumFractionDigits: 2
    }).format(price);

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
          <div className="text-center p-4">Loading inventory...</div>
        ) : inventoryList.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No inventory records found</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {productMap.get(item.product_id)?.name || `Product ${item.product_id}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.notes || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={item.inventory_type === "purchase" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {item.inventory_type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(item.total_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(item)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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