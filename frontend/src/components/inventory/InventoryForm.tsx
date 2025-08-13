import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Inventory, InventoryType, Product } from "@/types";
import { productApi } from "@/services/api";

interface InventoryFormProps {
  inventory?: Inventory | null;
  onSave: (inventory: Partial<Inventory>) => void;
  onCancel: () => void;
}

export const InventoryForm = ({
  inventory,
  onSave,
  onCancel,
}: InventoryFormProps) => {
  const [formData, setFormData] = useState<Partial<Inventory>>({
    product_id: inventory?.product_id ?? undefined,
    inventory_type: inventory?.inventory_type || "purchase",
    quantity: inventory?.quantity || 0,
    unit_price: inventory?.unit_price || 0,
    notes: inventory?.notes || "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const productsData = await productApi.getAll({ page: 1, limit: 1000 });
      setProducts(Array.isArray(productsData?.data) ? productsData.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  fetchProducts();
}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id) {
      setError("Please select a product");
      return;
    }

    const payload: Partial<Inventory> = {
      ...formData,
      total_quantity: formData.quantity,
      is_active: true,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {inventory ? "Edit Inventory" : "Add Inventory"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div>
            <Label htmlFor="product_id">Product *</Label>
            {loadingProducts ? (
              <div className="p-2 text-sm text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-sm text-red-500 p-2 bg-red-50 rounded-md">
                No products available. Please add products first.
              </div>
            ) : (
              <Select
                value={formData.product_id?.toString() || ""}
                onValueChange={(value) => {
                  setFormData({ ...formData, product_id: parseInt(value, 10) });
                  setError(null);
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id.toString()}
                      className="hover:bg-gray-100"
                    >
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Inventory Type */}
          <div>
            <Label htmlFor="inventory_type">Type *</Label>
            <Select
              value={formData.inventory_type}
              onValueChange={(value) =>
                setFormData({ ...formData, inventory_type: value as InventoryType })
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase" className="hover:bg-gray-100">
                  Purchase
                </SelectItem>
                <SelectItem value="sale" className="hover:bg-gray-100">
                  Sale
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="unit_price">Unit Price *</Label>
              <Input
                id="unit_price"
                type="number"
                min={0.01}
                step="0.01"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.product_id || !formData.quantity || !formData.unit_price}
            >
              {inventory ? "Update Inventory" : "Add Inventory"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};