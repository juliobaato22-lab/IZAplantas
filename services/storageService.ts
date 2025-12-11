import { Product, Order, FinanceEntry } from "../types";
import { MOCK_PRODUCTS_INIT } from "../constants";

const KEYS = {
  PRODUCTS: 'iza_products',
  ORDERS: 'iza_orders',
  FINANCE: 'iza_finance',
  CART: 'iza_cart',
};

// Initialize Storage if empty
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS_INIT));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.FINANCE)) {
    localStorage.setItem(KEYS.FINANCE, JSON.stringify([]));
  }
};

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProduct = (product: Product) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const deleteProduct = (id: string) => {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  
  // Update Stock
  const products = getProducts();
  order.items.forEach(item => {
    const pIndex = products.findIndex(p => p.id === item.id);
    if (pIndex >= 0) {
      products[pIndex].stock = Math.max(0, products[pIndex].stock - item.quantity);
    }
  });
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

  // Add to Finance
  const finance: FinanceEntry[] = getFinance();
  finance.push({
    id: Date.now().toString(),
    type: 'income',
    description: `Venda #${order.id.slice(0,6)}`,
    amount: order.total,
    date: new Date().toISOString(),
    category: 'Vendas',
    status: 'paid'
  });
  localStorage.setItem(KEYS.FINANCE, JSON.stringify(finance));
};

export const getFinance = (): FinanceEntry[] => {
  const data = localStorage.getItem(KEYS.FINANCE);
  return data ? JSON.parse(data) : [];
};

export const saveFinanceEntry = (entry: FinanceEntry) => {
  const entries = getFinance();
  entries.push(entry);
  localStorage.setItem(KEYS.FINANCE, JSON.stringify(entries));
};

// Simple Cart Persistence
export const getCart = () => {
  const data = localStorage.getItem(KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: any[]) => {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
};