import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Inventory, Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { inventoryApi, productApi } from "@/services/api";

interface InventoryTableProps {
  inventory?: Inventory[]; // Optional inventory from props
  onEdit?: (item: Inventory) => void;
  onDelete?: (item: Inventory) => void;
  refreshSignal?: number;
}

export const InventoryTable = ({
  inventory: propInventory,
  onEdit,
  onDelete,
  refreshSignal,
}: InventoryTableProps) => {
  const [internalInventory, setInternalInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Use prop inventory if provided, otherwise use state
  const inventory = propInventory ?? internalInventory;

  // Map product_id → Product for quick lookup
  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  // Fetch inventory & products
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Only fetch inventory if not provided via props
      if (propInventory === undefined) {
        const inventoryRes = await inventoryApi.getAll({ page: 1, limit: 20 });
        const inventoryData = Array.isArray(inventoryRes?.data?.data)
          ? inventoryRes.data.data
          : [];
        setInternalInventory(inventoryData);
      }

      const productsData = await productApi.getAll();
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load inventory or products", error);
      setInternalInventory([]);
    } finally {
      setLoading(false);
    }
  }, [propInventory]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshSignal]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  if (loading) return <div>Loading inventory...</div>;
  if (inventory.length === 0)
    return <div className="text-center p-4">No inventory records found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Unit Price
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-s font-medium text-gray-500 uppercase">
              Actions
            </th>
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
                    variant={
                      item.inventory_type === "purchase" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {item.inventory_type}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "BDT",
                  }).format(item.unit_price)}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
