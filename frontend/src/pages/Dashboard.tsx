// import { useState, useMemo } from "react";
// import { useProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
// import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory";
// import { ProductForm } from "@/components/products/ProductForm";
// import { ProductTable } from "@/components/products/ProductTable";
// import { InventoryTable } from "@/components/inventory/InventoryTable";
// import { Header } from "@/components/layout/Header";
// import { StatsCard } from "@/components/dashboard/StatsCard";
// import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import type { Product, Inventory } from "@/types";
// import { InventoryForm } from "@/components/inventory/InventoryForm";

// export default function Dashboard() {
//   // Products state and hooks
//   const { 
//     data: productsData, 
//     isLoading: productsLoading, 
//     error: productsError 
//   } = useProducts();
  
//   const createProduct = useCreateProduct();
//   const updateProduct = useUpdateProduct();
  
//   // Inventory state and hooks
//   const { 
//     data: inventoryData, 
//     isLoading: inventoryLoading, 
//     error: inventoryError 
//   } = useInventory();
  
//   const createInventory = useCreateInventory();
//   const updateInventory = useUpdateInventory();
//   const deleteInventory = useDeleteInventory();
  
//   // Form visibility states
//   const [productFormState, setProductFormState] = useState<{
//     show: boolean;
//     product: Product | null;
//   }>({ show: false, product: null });

//   const [inventoryFormState, setInventoryFormState] = useState<{
//     show: boolean;
//     inventory: Inventory | null;
//   }>({ show: false, inventory: null });

//   // Memoized calculations for stats with proper array checks
//   const stats = useMemo(() => {
//     const products = Array.isArray(productsData?.data) ? productsData.data : [];
//     const inventory = Array.isArray(inventoryData?.data) ? inventoryData.data : [];
    
//     return {
//       products: {
//         value: products.length,
//         loading: productsLoading,
//         error: productsError
//       },
//       inventory: {
//         value: inventory.length,
//         loading: inventoryLoading,
//         error: inventoryError
//       },
//       stock: {
//         value: products.reduce(
//           (sum: number, product: Product) => sum + (product.available_stock || 0), 
//           0
//         ),
//         loading: productsLoading,
//         error: productsError
//       },
//       sales: {
//         value: inventory.filter(
//           (item: Inventory) => item.inventory_type === "sale"
//         ).length,
//         loading: inventoryLoading,
//         error: inventoryError
//       }
//     };
//   }, [productsData, inventoryData, productsLoading, inventoryLoading, productsError, inventoryError]);

//   const handleProductSubmit = async (data: Partial<Product>) => {
//     try {
//       if (productFormState.product?.id) {
//         await updateProduct.mutateAsync({ 
//           id: productFormState.product.id, 
//           data 
//         });
//         toast({
//           title: "Success",
//           description: "Product updated successfully",
//         });
//       } else {
//         await createProduct.mutateAsync(data);
//         toast({
//           title: "Success",
//           description: "Product created successfully",
//         });
//       }
//       setProductFormState({ show: false, product: null });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save product",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleInventorySubmit = async (data: Partial<Inventory>) => {
//     try {
//       if (inventoryFormState.inventory?.id) {
//         await updateInventory.mutateAsync({ 
//           id: inventoryFormState.inventory.id, 
//           data 
//         });
//         toast({
//           title: "Success",
//           description: "Inventory updated successfully",
//         });
//       } else {
//         await createInventory.mutateAsync(data);
//         toast({
//           title: "Success",
//           description: "Inventory created successfully",
//         });
//       }
//       setInventoryFormState({ show: false, inventory: null });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save inventory",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteInventory = async (item: Inventory) => {
//     try {
//       await deleteInventory.mutateAsync(item.id);
//       toast({
//         title: "Success",
//         description: "Inventory deleted successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete inventory",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header 
//         onAddProduct={() => setProductFormState({ show: true, product: null })} 
//       />
      
//       <div className="p-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatsCard 
//             title="Total Products" 
//             value={stats.products.value.toString()} 
//             icon={Package}
//             variant={stats.products.error ? "warning" : "default"}
//           />
//           <StatsCard 
//             title="Total Stock" 
//             value={stats.stock.value.toString()} 
//             icon={ShoppingCart}
//             variant={stats.stock.error ? "warning" : "default"}
//           />
//           <StatsCard 
//             title="Total Sales" 
//             value={stats.sales.value.toString()} 
//             icon={DollarSign}
//             variant={stats.sales.error ? "warning" : "default"}
//           />
//           <StatsCard 
//             title="Inventory Items" 
//             value={stats.inventory.value.toString()} 
//             icon={TrendingUp}
//             variant={stats.inventory.error ? "warning" : "default"}
//           />
//         </div>
        
//         {/* Products Section */}
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Products</h2>
//             <Button 
//               onClick={() => setProductFormState({ show: true, product: null })}
//             >
//               Add Product
//             </Button>
//           </div>
          
//           {productsLoading ? (
//             <div className="py-8 text-center">Loading products...</div>
//           ) : productsError ? (
//             <div className="py-8 text-center text-red-500">
//               Error loading products: {productsError.message}
//             </div>
//           ) : (
//             <ProductTable 
//               products={Array.isArray(productsData?.data) ? productsData.data : []}
//               onEdit={(product) => setProductFormState({ show: true, product })}
//             />
//           )}
//         </div>
        
//         {/* Inventory Section */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Inventory</h2>
//             <Button 
//               onClick={() => setInventoryFormState({ show: true, inventory: null })}
//             >
//               Add Inventory
//             </Button>
//           </div>
          
//           {inventoryLoading ? (
//             <div className="py-8 text-center">Loading inventory...</div>
//           ) : inventoryError ? (
//             <div className="py-8 text-center text-red-500">
//               Error loading inventory: {inventoryError.message}
//             </div>
//           ) : (
//             <InventoryTable 
//               inventory={Array.isArray(inventoryData?.data) ? inventoryData.data : []}
//               onEdit={(item) => setInventoryFormState({ show: true, inventory: item })}
//               onDelete={handleDeleteInventory}
//             />
//           )}
//         </div>
//       </div>
      
//       {/* Product Form Modal */}
//       {productFormState.show && (
//         <ProductForm 
//           product={productFormState.product}
//           onSave={handleProductSubmit}
//           onCancel={() => setProductFormState({ show: false, product: null })}
//         />
//       )}
      
//       {/* Inventory Form Modal */}
//       {inventoryFormState.show && (
//         <InventoryForm 
//           inventory={inventoryFormState.inventory}
//           products={Array.isArray(productsData?.data) ? productsData.data : []}
//           onSave={handleInventorySubmit}
//           onCancel={() => setInventoryFormState({ show: false, inventory: null })}
//         />
//       )}
//     </div>
//   );
// }






import { useState, useMemo } from "react";
import { useProducts, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from "@/hooks/useInventory";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductTable } from "@/components/products/ProductTable";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import type { Product, Inventory, ProductCreate } from "@/types";
import { InventoryForm } from "@/components/inventory/InventoryForm";

export default function Dashboard() {
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
    // Calculate payable_price
    const payablePrice = data.discount_type === 'percentage' 
      ? data.price * (1 - (data.discount_amount / 100))
      : data.price - data.discount_amount;

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

    const productData: ProductCreate = {
      name: data.name,
      description: data.description,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      price: data.price,
      discount_type: data.discount_type,
      discount_amount: data.discount_amount,
      available_stock: data.available_stock,
      is_active: data.is_active,
    };

    if (productFormState.product?.id) {
      // For updates, include the ID and let backend handle other fields
      await updateProduct.mutateAsync({
        id: productFormState.product.id,
        data: {
          ...productData,
          // Include any additional fields needed for update
        }
      });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } else {
      // For creation
      await createProduct.mutateAsync(productData);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    }
    setProductFormState({ show: false, product: null });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to save product",
      variant: "destructive",
    });
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
              products={Array.isArray(productsData?.data) ? productsData.data : []}
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
              inventory={Array.isArray(inventoryData?.data) ? inventoryData.data : []}
              onEdit={(item) => setInventoryFormState({ show: true, inventory: item })}
              onDelete={handleDeleteInventory}
            />
          )}
        </div>
      </div>
      
      {/* Product Form Modal */}
      {productFormState.show && (
        <ProductForm 
          product={productFormState.product}
          onSave={handleProductSubmit}
          onCancel={() => setProductFormState({ show: false, product: null })}
        />
      )}
      
      {/* Inventory Form Modal */}
      {inventoryFormState.show && (
        <InventoryForm 
          inventory={inventoryFormState.inventory}
          products={Array.isArray(productsData?.data) ? productsData.data : []}
          onSave={handleInventorySubmit}
          onCancel={() => setInventoryFormState({ show: false, inventory: null })}
        />
      )}
    </div>
  );
}