export interface ProductCreate {
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  price: number;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  available_stock: number;
  is_active: boolean;
}

export interface Product extends ProductCreate {
  id: number;
  slug: string;
  payable_price: number;
  total_stock: number;
  quantity_sold: number;
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

export interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}