import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProductTable, Product } from "@/components/products/ProductTable";
import { ProductForm } from "@/components/products/ProductForm";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      stock: 45,
      price: 129.99,
      status: "in-stock",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "Gaming Keyboard",
      sku: "GK-002",
      category: "Electronics",
      stock: 8,
      price: 89.99,
      status: "low-stock",
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      name: "Coffee Maker",
      sku: "CM-003",
      category: "Home & Garden",
      stock: 0,
      price: 199.99,
      status: "out-of-stock",
      lastUpdated: "2024-01-10",
    },
    {
      id: "4",
      name: "Running Shoes",
      sku: "RS-004",
      category: "Sports",
      stock: 23,
      price: 159.99,
      status: "in-stock",
      lastUpdated: "2024-01-12",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const lowStockItems = products.filter(p => p.status === "low-stock" || p.status === "out-of-stock").length;
    const inStockItems = products.filter(p => p.status === "in-stock").length;

    return {
      totalProducts,
      totalValue,
      lowStockItems,
      inStockItems,
    };
  }, [products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productData }
          : p
      ));
      toast({
        title: "Product updated",
        description: "Product has been successfully updated.",
      });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productData as Product,
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Product added",
        description: "New product has been successfully added to inventory.",
      });
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id));
    toast({
      title: "Product deleted",
      description: `${product.name} has been removed from inventory.`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAddProduct={handleAddProduct}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Inventory Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="In Stock Items"
            value={stats.inStockItems}
            icon={TrendingUp}
            variant="info"
          />
          <StatsCard
            title="Low Stock Alert"
            value={stats.lowStockItems}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;