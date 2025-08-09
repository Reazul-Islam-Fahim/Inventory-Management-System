import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductTable } from "@/components/products/ProductTable";
import { InventoryForm } from "@/components/inventory/InventoryForm";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function Index() {
  // Products state and hooks
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  // Inventory state and hooks
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  
  // Form visibility states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | any>(null);
  const [selectedInventory, setSelectedInventory] = useState<null | any>(null);
  
  // Calculate stats
  const totalProducts = productsData?.data?.length || 0;
  const totalInventory = inventoryData?.data?.length || 0;
  const totalStock = productsData?.data?.reduce((sum: number, product: any) => sum + product.available_stock, 0) || 0;
  const totalSales = inventoryData?.data?.filter((item: any) => item.inventory_type === "sale").length || 0;

  const handleProductSubmit = async (data: any) => {
    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({ id: selectedProduct.id, data });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await createProduct.mutateAsync(data);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      setShowProductForm(false);
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleInventorySubmit = async (data: any) => {
    try {
      if (selectedInventory) {
        await updateInventory.mutateAsync({ id: selectedInventory.id, data });
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
      setShowInventoryForm(false);
      setSelectedInventory(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inventory",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInventory = async (item: any) => {
    try {
      await deleteInventory.mutateAsync(item.id);
      toast({
        title: "Success",
        description: "Inventory deleted successfully",
      });
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
        onAddProduct={() => {
          setSelectedProduct(null);
          setShowProductForm(true);
        }} 
      />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Total Products" 
            value={totalProducts} 
            icon={Package} 
          />
          <StatsCard 
            title="Total Stock" 
            value={totalStock} 
            icon={ShoppingCart} 
          />
          <StatsCard 
            title="Total Sales" 
            value={totalSales} 
            icon={DollarSign} 
          />
          <StatsCard 
            title="Inventory Items" 
            value={totalInventory} 
            icon={TrendingUp} 
          />
        </div>
        
        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Products</h2>
            <Button 
              onClick={() => {
                setSelectedProduct(null);
                setShowProductForm(true);
              }}
            >
              Add Product
            </Button>
          </div>
          
          {productsLoading ? (
            <div>Loading products...</div>
          ) : (
            <ProductTable 
              products={productsData?.data || []}
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowProductForm(true);
              }}
            />
          )}
        </div>
        
        {/* Inventory Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Inventory</h2>
            <Button 
              onClick={() => {
                setSelectedInventory(null);
                setShowInventoryForm(true);
              }}
            >
              Add Inventory
            </Button>
          </div>
          
          {inventoryLoading ? (
            <div>Loading inventory...</div>
          ) : (
            <InventoryTable 
              inventory={inventoryData?.data || []}
              onEdit={(item) => {
                setSelectedInventory(item);
                setShowInventoryForm(true);
              }}
              onDelete={handleDeleteInventory}
            />
          )}
        </div>
      </div>
      
      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          product={selectedProduct}
          onSave={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
      
      {/* Inventory Form Modal */}
      {showInventoryForm && (
        <InventoryForm 
          inventory={selectedInventory}
          products={productsData?.data || []}
          onSave={handleInventorySubmit}
          onCancel={() => {
            setShowInventoryForm(false);
            setSelectedInventory(null);
          }}
        />
      )}
    </div>
  );
}