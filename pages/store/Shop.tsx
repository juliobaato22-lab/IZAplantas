import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { getProducts, getCart, saveCart } from '../../services/storageService';
import { Product, CartItem } from '../../types';
import { CATEGORIES } from '../../constants';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentCategory = searchParams.get('category') || 'Todos';

  useEffect(() => {
    const allProducts = getProducts();
    const activeProducts = allProducts.filter(p => p.status === 'active' && p.stock > 0);
    setProducts(activeProducts);
  }, []);

  useEffect(() => {
    let result = products;

    if (currentCategory !== 'Todos') {
      result = result.filter(p => p.category === currentCategory);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [currentCategory, searchTerm, products]);

  const addToCart = (product: Product) => {
    const cart: CartItem[] = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    window.dispatchEvent(new Event('cart-updated'));
    alert(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-iza-green">Loja Online</h1>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-iza-brown/30 bg-white text-gray-900 focus:outline-none focus:border-iza-brown"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
        <button 
          onClick={() => setSearchParams({})}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition ${currentCategory === 'Todos' ? 'bg-iza-green text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          Todos
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${currentCategory === cat ? 'bg-iza-green text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group border border-gray-100">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                  <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-xs text-iza-brown font-semibold uppercase tracking-wide mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-800 mb-2 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-iza-green">
                    R$ {product.salePrice.toFixed(2).replace('.', ',')}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-iza-mint text-iza-green hover:bg-iza-green hover:text-white p-2 rounded-full transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;