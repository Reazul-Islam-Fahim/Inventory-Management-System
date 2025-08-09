export interface Product {
  id: number;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  price: number;
  payable_price: number;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  total_stock: number;
  available_stock: number;
  quantity_sold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InventoryType = "purchase" | "sale";

export interface Inventory {
  id: number;
  unit_price: number;
  total_quantity: number;
  total_price: number;
  inventory_type: InventoryType;
  notes: string;
  is_active: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
  product_id: number;
  product?: Product;
}