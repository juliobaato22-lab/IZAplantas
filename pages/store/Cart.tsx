import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { getCart, saveCart, saveOrder } from '../../services/storageService';
import { CartItem, Order } from '../../types';
import { STORE_INFO } from '../../constants';
import { v4 as uuidv4 } from 'uuid'; // Just kidding, using Date.now for simplicity

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    saveCart(newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    saveCart(newCart);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const total = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Create Order Record
    const order: Order = {
      id: Date.now().toString(),
      customerName: 'Cliente Site', // In a real app, we'd ask for this
      customerPhone: '',
      items: cart,
      total: total,
      status: 'pending',
      paymentMethod: 'whatsapp_negotiation',
      date: new Date().toISOString(),
      type: 'delivery'
    };
    
    saveOrder(order);

    // Format WhatsApp Message
    let message = `*Pedido via IZAplantas - Floricultura*\n\n`;
    message += `🌼 *Itens do Pedido:*\n`;
    cart.forEach(item => {
      message += `• ${item.name} – Qtd: ${item.quantity} – Preço: R$ ${item.salePrice.toFixed(2)} – Subtotal: R$ ${(item.salePrice * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${total.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${STORE_INFO.whatsapp}?text=${encodedMessage}`;

    // Clear cart and redirect
    saveCart([]);
    window.dispatchEvent(new Event('cart-updated'));
    window.open(waUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm inline-block">
          <ShoppingBag className="w-16 h-16 text-iza-mint mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Que tal escolher algumas plantas para alegrar seu dia?</p>
          <a href="#/shop" className="bg-iza-green text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition">
            Ir para a Loja
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-iza-green mb-8">Seu Carrinho</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items List */}
        <div className="lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <span className="text-iza-green font-medium block mt-1">R$ {item.salePrice.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-50 text-gray-500"><Minus className="w-4 h-4" /></button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-50 text-gray-500"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-1/3 h-fit bg-white p-6 rounded-2xl shadow-sm border border-iza-mint">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>
          
          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <span className="text-sm italic">A combinar no WhatsApp</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-iza-green pt-4 border-t border-gray-100">
              <span>Total Estimado</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30 transition transform hover:-translate-y-1"
          >
            <Send className="w-5 h-5" />
            Finalizar no WhatsApp
          </button>
          <p className="text-xs text-center text-gray-400 mt-4">
            Você será redirecionado para o WhatsApp da IZAplantas para combinar a entrega e o pagamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;