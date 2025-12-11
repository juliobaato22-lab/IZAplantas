export type Category = 'Plantas' | 'Vasos' | 'Terra' | 'Substrato' | 'Acessórios' | 'Decoração';

export interface ProductDetails {
  // Plantas
  scientificName?: string;
  sunNeeds?: 'Sol Pleno' | 'Meia Sombra' | 'Sombra';
  wateringFreq?: string;
  care?: string;
  // Terra/Substrato
  ph?: number;
  composition?: string;
  granulometry?: string;
  weight?: string;
  // Vasos
  material?: string;
  dimensions?: string; // HxW
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: Category;
  subCategory?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: 'active' | 'inactive' | 'order' | 'discontinued';
  image: string; // DataURL
  details: ProductDetails;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  date: string;
  type: 'delivery' | 'pickup' | 'pos';
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category: string;
  status: 'paid' | 'pending';
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  lowStockCount: number;
  revenue: number;
}