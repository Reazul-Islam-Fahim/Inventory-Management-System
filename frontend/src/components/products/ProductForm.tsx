// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { X } from "lucide-react";
// import { Product } from "@/types";

// interface ProductFormProps {
//   product?: Product | null;
//   onSave: (product: Partial<Product>) => void;
//   onCancel: () => void;
// }

// export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
//   const [formData, setFormData] = useState({
//     name: product?.name || "",
//     description: product?.description || "",
//     meta_title: product?.meta_title || "",
//     meta_description: product?.meta_description || "",
//     price: product?.price || 0,
//     discount_type: product?.discount_type || "percentage",
//     discount_amount: product?.discount_amount || 0,
//     is_active: product?.is_active ?? true,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">
//             {product ? "Edit Product" : "Add New Product"}
//           </h2>
//           <Button variant="ghost" size="sm" onClick={onCancel}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="name">Product Name</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>
          
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             />
//           </div>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="price">Price</Label>
//               <Input
//                 id="price"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
//                 required
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="discount_type">Discount Type</Label>
//               <Select
//                 value={formData.discount_type}
//                 onValueChange={(value) => setFormData({ ...formData, discount_type: value as "fixed" | "percentage" })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select discount type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="percentage">Percentage</SelectItem>
//                   <SelectItem value="fixed">Fixed Amount</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <div>
//             <Label htmlFor="discount_amount">Discount Amount</Label>
//             <Input
//               id="discount_amount"
//               type="number"
//               min="0"
//               value={formData.discount_amount}
//               onChange={(e) => setFormData({ ...formData, discount_amount: parseInt(e.target.value) })}
//             />
//           </div>
          
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button type="submit">
//               {product ? "Update Product" : "Add Product"}
//             </Button>
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

import { useForm } from "react-hook-form";
import { Product, ProductCreate } from "@/types";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  product?: Product;  // Full product for editing
  onSave: (data: ProductCreate) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<ProductCreate>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      meta_title: product.meta_title,
      meta_description: product.meta_description,
      price: product.price,
      discount_type: product.discount_type,
      discount_amount: product.discount_amount,
      available_stock: product.available_stock,
      is_active: product.is_active,
    } : {
      name: '',
      description: '',
      meta_title: '',
      meta_description: '',
      price: 0,
      discount_type: 'percentage',
      discount_amount: 0,
      available_stock: 0,
      is_active: true,
    }
  });

  const onSubmit = (data: ProductCreate) => {
    onSave(data);
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name (Required) */}
        <div className="md:col-span-2">
          <Label htmlFor="name">Product Name*</Label>
          <Input
            id="name"
            {...register("name", { required: "Product name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Price (Required) */}
        <div>
          <Label htmlFor="price">Price*</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { 
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
              valueAsNumber: true
            })}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
            <Label htmlFor="is_active">Active Product</Label>
          </div>
        </div>

        {/* Discount Type */}
        <div>
          <Label htmlFor="discount_type">Discount Type</Label>
          <Select
            onValueChange={(value: 'percentage' | 'fixed') => setValue("discount_type", value)}
            value={watch("discount_type") || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="No discount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discount Amount */}
        <div>
          <Label htmlFor="discount_amount">Discount Amount</Label>
          <Input
            id="discount_amount"
            type="number"
            {...register("discount_amount", { 
              min: { value: 0, message: "Discount must be positive" },
              valueAsNumber: true
            })}
          />
          {errors.discount_amount && (
            <p className="mt-1 text-sm text-destructive">{errors.discount_amount.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={3}
          />
        </div>

        {/* Meta Title */}
        <div>
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" {...register("meta_title")} />
        </div>

        {/* Meta Description */}
        <div>
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            {...register("meta_description")}
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
};