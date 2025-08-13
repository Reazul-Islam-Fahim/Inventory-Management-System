import { useState, useMemo } from "react";
import { useProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory";
import { ProductTable } from "@/components/products/ProductTable";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import type { Product, Inventory, ProductCreate } from "@/types";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { ProductFormModal } from "@/components/products/ProductFormModal";

export default function Dashboard() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  // Products state and hooks
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError
  } = useProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // Inventory state and hooks
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    error: inventoryError
  } = useInventory();

  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // Form visibility states
  const [productFormState, setProductFormState] = useState<{
    show: boolean;
    product: Product | null;
  }>({ show: false, product: null });

  const [inventoryFormState, setInventoryFormState] = useState<{
    show: boolean;
    inventory: Inventory | null;
  }>({ show: false, inventory: null });

  // Memoized calculations for stats with proper array checks
  const stats = useMemo(() => {
    const products = Array.isArray(productsData?.data) ? productsData.data : [];
    const inventory = Array.isArray(inventoryData?.data) ? inventoryData.data : [];

    return {
      products: {
        value: products.length,
        loading: productsLoading,
        error: productsError
      },
      inventory: {
        value: inventory.length,
        loading: inventoryLoading,
        error: inventoryError
      },
      stock: {
        value: products.reduce(
          (sum: number, product: Product) => sum + (product.available_stock || 0),
          0
        ),
        loading: productsLoading,
        error: productsError
      },
      sales: {
        value: inventory.filter(
          (item: Inventory) => item.inventory_type === "sale"
        ).length,
        loading: inventoryLoading,
        error: inventoryError
      }
    };
  }, [productsData, inventoryData, productsLoading, inventoryLoading, productsError, inventoryError]);

  const handleProductSubmit = async (data: ProductCreate) => {
    try {
      if (productFormState.product?.id) {
        await updateProduct.mutateAsync({ id: productFormState.product.id, data });
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await createProduct.mutateAsync(data);
        toast({ title: "Success", description: "Product created successfully" });
      }
      setProductFormState({ show: false, product: null });
    } catch {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleInventorySubmit = async (data: Partial<Inventory>) => {
    try {
      if (inventoryFormState.inventory?.id) {
        await updateInventory.mutateAsync({
          id: inventoryFormState.inventory.id,
          data
        });
        toast({
          title: "Success",
          description: "Inventory updated successfully",
        });
      } else {
        await createInventory.mutateAsync(data);
        toast({
          title: "Success",
          description: "Inventory created successfully",
        });
      }
      setInventoryFormState({ show: false, inventory: null });
      setRefreshSignal(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inventory",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInventory = async (item: Inventory) => {
    try {
      await deleteInventory.mutateAsync(item.id);
      toast({
        title: "Success",
        description: "Inventory deleted successfully",
      });
      setRefreshSignal(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete inventory",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddProduct={() => setProductFormState({ show: true, product: null })}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Products"
            value={stats.products.value.toString()}
            icon={Package}
            variant={stats.products.error ? "warning" : "default"}
          />
          <StatsCard
            title="Total Stock"
            value={stats.stock.value.toString()}
            icon={ShoppingCart}
            variant={stats.stock.error ? "warning" : "default"}
          />
          <StatsCard
            title="Total Sales"
            value={stats.sales.value.toString()}
            icon={DollarSign}
            variant={stats.sales.error ? "warning" : "default"}
          />
          <StatsCard
            title="Inventory Items"
            value={stats.inventory.value.toString()}
            icon={TrendingUp}
            variant={stats.inventory.error ? "warning" : "default"}
          />
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Products</h2>
            <Button
              onClick={() => setProductFormState({ show: true, product: null })}
            >
              Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div className="py-8 text-center">Loading products...</div>
          ) : productsError ? (
            <div className="py-8 text-center text-red-500">
              Error loading products: {productsError.message}
            </div>
          ) : (
            <ProductTable
              // products={productsData || { data: [] }}
              onEdit={(product) => setProductFormState({ show: true, product })}
            />
          )}
        </div>

        {/* Inventory Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Inventory</h2>
            <Button
              onClick={() => setInventoryFormState({ show: true, inventory: null })}
            >
              Add Inventory
            </Button>
          </div>

          {inventoryLoading ? (
            <div className="py-8 text-center">Loading inventory...</div>
          ) : inventoryError ? (
            <div className="py-8 text-center text-red-500">
              Error loading inventory: {inventoryError.message}
            </div>
          ) : (
            <InventoryTable
              inventory={Array.isArray(inventoryData?.data?.data) ? inventoryData.data.data : []}
              onEdit={(item) => setInventoryFormState({ show: true, inventory: item })}
              onDelete={handleDeleteInventory}
              refreshSignal={refreshSignal}
            />
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {productFormState.show && (
        <ProductFormModal
          open={productFormState.show}
          product={productFormState.product}
          onSave={handleProductSubmit}
          onClose={() => setProductFormState({ show: false, product: null })}
        />
      )}

      {/* Inventory Form Modal */}
      {inventoryFormState.show && (
        <InventoryForm
          inventory={inventoryFormState.inventory}
          onSave={handleInventorySubmit}
          onCancel={() => setInventoryFormState({ show: false, inventory: null })}
        />
      )}
    </div>
  );
}