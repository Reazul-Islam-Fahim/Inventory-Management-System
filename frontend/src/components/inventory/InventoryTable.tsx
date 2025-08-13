import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Inventory, Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { inventoryApi, productApi } from "@/services/api";

interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface InventoryTableProps {
  inventory?: Inventory[];
  products?: Product[];
  onEdit?: (item: Inventory) => void;
  onDelete?: (item: Inventory) => void;
  refreshSignal?: number;
}

export const InventoryTable = ({
  inventory: propInventory,
  products: propProducts,
  onEdit,
  onDelete,
  refreshSignal,
}: InventoryTableProps) => {
  const [internalInventory, setInternalInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<Meta | undefined>(undefined);

  // Use props if provided, otherwise internal state
  const inventory = propInventory ?? internalInventory;
  const productsList = propProducts ?? products;

  // Map product_id → Product
  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    productsList.forEach((p) => map.set(p.id, p));
    return map;
  }, [productsList]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch inventory only if propInventory not provided
      if (!propInventory) {
        const res = await inventoryApi.getAll({ page, limit });
        setInternalInventory(Array.isArray(res.data?.data) ? res.data.data : []);
        if (res.data?.meta) setMeta(res.data.meta);
      }

      // Fetch products only if propProducts not provided
      if (!propProducts) {
        const productsRes = await productApi.getAll({ page: 1, limit: 1000 });
        setProducts(Array.isArray(productsRes.data?.data) ? productsRes.data.data : []);
      }
    } catch (error) {
      console.error("Failed to load inventory or products", error);
      if (!propInventory) setInternalInventory([]);
      if (!propProducts) setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [propInventory, propProducts, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page, limit, refreshSignal]);

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : "-";

  if (loading) return <div>Loading inventory...</div>;
  if (inventory.length === 0)
    return <div className="text-center p-4 text-gray-500">No inventory records found.</div>;

  // Pagination numbers (numeric pages like ProductTable)
  const pageNumbers = meta ? Array.from({ length: meta.pages }, (_, i) => i + 1) : [];

  return (
    <div>
      {/* Pagination controls */}
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

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const product = productMap.get(item.product_id);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {product ? product.name : `Product ID ${item.product_id}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={item.inventory_type === "purchase" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {item.inventory_type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "BDT",
                    }).format(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(item)} className="h-8 w-8 p-0">
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
              );
            })}
          </tbody>
        </table>
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
