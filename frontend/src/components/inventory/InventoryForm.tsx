import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Inventory, InventoryType, Product } from "@/types";

interface InventoryFormProps {
    inventory?: Inventory | null;
    products: Product[];
    onSave: (inventory: Partial<Inventory>) => void;
    onCancel: () => void;
}

export const InventoryForm = ({ inventory, products, onSave, onCancel }: InventoryFormProps) => {
    const [formData, setFormData] = useState<Partial<Inventory>>({
        product_id: inventory?.product_id || 0,
        inventory_type: inventory?.inventory_type || "purchase",
        quantity: inventory?.quantity || 0,
        unit_price: inventory?.unit_price || 0,
        notes: inventory?.notes || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {inventory ? "Edit Inventory" : "Add Inventory"}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="product_id">Product</Label>
                        <Select
                            value={formData.product_id.toString()}
                            onValueChange={(value) => setFormData({ ...formData, product_id: parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="inventory_type">Type</Label>
                        <Select
                            value={formData.inventory_type}
                            onValueChange={(value) => setFormData({ ...formData, inventory_type: value as InventoryType })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="purchase">Purchase</SelectItem>
                                <SelectItem value="sale">Sale</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="unit_price">Unit Price</Label>
                            <Input
                                id="unit_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.unit_price}
                                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="submit">
                            {inventory ? "Update Inventory" : "Add Inventory"}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};