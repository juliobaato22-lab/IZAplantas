import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Trash2, CheckCircle, Clock, XCircle, Printer, Eye, User } from 'lucide-react';
import { getOrders, getProducts, saveOrder, updateOrder } from '../../services/storageService';
import { Order, Product, CartItem } from '../../types';

const AdminSales = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'pos'>('history');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // POS State
  const [posSearch, setPosSearch] = useState('');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Cliente Balcão');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setOrders(getOrders().reverse()); // Newest first
    setProducts(getProducts().filter(p => p.status === 'active'));
  };

  // --- Print Function ---
  const handlePrint = (order: Order) => {
    const printContent = `
      <html>
        <head>
          <title>Recibo - Pedido #${order.id.slice(-6)}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            .total { margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            @media print {
              body { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>IZAplantas</h3>
            <p>Vila Marambaia KM6</p>
            <p>Tel: (73) 99953-5407</p>
            <br/>
            <p>Pedido: #${order.id.slice(-6)}</p>
            <p>Data: ${new Date(order.date).toLocaleString()}</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Cliente:</strong> ${order.customerName}
          </div>

          <div>
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>R$ ${(item.salePrice * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="total">
            <span>TOTAL</span>
            <span>R$ ${order.total.toFixed(2)}</span>
          </div>
          
          <div style="margin-top: 10px; font-size: 14px;">
            <span>Forma Pagto: ${order.paymentMethod}</span>
          </div>

          <div class="footer">
            <p>Obrigado pela preferência!</p>
            <p>Volte sempre.</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert('Por favor, permita pop-ups para imprimir o recibo.');
    }
  };

  // --- POS Functions ---
  const addToPosCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('Produto sem estoque!');
      return;
    }
    
    const existing = posCart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Estoque insuficiente para adicionar mais itens.');
        return;
      }
      setPosCart(posCart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setPosCart([...posCart, { ...product, quantity: 1 }]);
    }
  };

  const updatePosQuantity = (id: string, delta: number) => {
    setPosCart(posCart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        // Check stock limit
        const product = products.find(p => p.id === id);
        if (product && newQty > product.stock) {
          alert('Estoque limite atingido');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromPosCart = (id: string) => {
    setPosCart(posCart.filter(item => item.id !== id));
  };

  const handleFinalizeSale = () => {
    if (posCart.length === 0) return;

    const total = posCart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      customerPhone: '',
      items: posCart,
      total,
      status: 'completed', // POS sales are usually completed immediately
      paymentMethod,
      date: new Date().toISOString(),
      type: 'pos'
    };

    saveOrder(newOrder);
    alert('Venda realizada com sucesso!');
    
    // Reset POS
    setPosCart([]);
    setCustomerName('Cliente Balcão');
    setPaymentMethod('Dinheiro');
    refreshData();
    setActiveTab('history');
  };

  const posTotal = posCart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.code.toLowerCase().includes(posSearch.toLowerCase()));

  // --- History Functions ---
  const handleStatusChange = (order: Order, newStatus: 'pending' | 'completed' | 'cancelled') => {
    const updatedOrder = { ...order, status: newStatus };
    updateOrder(updatedOrder);
    refreshData();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3 mr-1" /> Concluído</span>;
      case 'pending': return <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold"><Clock className="w-3 h-3 mr-1" /> Pendente</span>;
      case 'cancelled': return <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-bold"><XCircle className="w-3 h-3 mr-1" /> Cancelado</span>;
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Vendas & PDV</h2>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'history' ? 'bg-iza-green text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Histórico
          </button>
          <button 
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'pos' ? 'bg-iza-green text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            PDV (Nova Venda)
          </button>
        </div>
      </div>

      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left: Product Selection */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produto por nome ou código..." 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-iza-green bg-gray-50"
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <button 
                    key={product.id} 
                    onClick={() => addToPosCart(product)}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-iza-green hover:shadow-md transition text-left flex flex-col h-full"
                  >
                    <div className="h-24 w-full bg-gray-100 rounded-md mb-2 overflow-hidden">
                       <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{product.name}</h4>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-iza-green font-bold text-sm">R$ {product.salePrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">Est: {product.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Cart & Checkout */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-iza-green flex flex-col h-full">
            <div className="p-4 bg-iza-green text-white rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Carrinho Atual</h3>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">{posCart.length} itens</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {posCart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Carrinho vazio</p>
                </div>
              ) : (
                posCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-gray-800 truncate text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">R$ {item.salePrice.toFixed(2)} un</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updatePosQuantity(item.id, -1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">-</button>
                      <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updatePosQuantity(item.id, 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
                      <button onClick={() => removeFromPosCart(item.id)} className="text-red-400 hover:text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cliente</label>
                <div className="flex items-center bg-white border border-gray-300 rounded px-2">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <input 
                    type="text" 
                    className="w-full py-2 text-sm outline-none"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Pagamento</label>
                <select 
                  className="w-full p-2 text-sm bg-white border border-gray-300 rounded outline-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2 text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>R$ {posTotal.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleFinalizeSale}
                disabled={posCart.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition transform active:scale-95 ${posCart.length > 0 ? 'bg-iza-green hover:bg-[#255a32]' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Itens</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Pagamento</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-400">Nenhuma venda registrada.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-500 font-mono text-xs">#{order.id.slice(-6)}</td>
                      <td className="p-4 text-gray-600">{new Date(order.date).toLocaleDateString()} <span className="text-xs text-gray-400 block">{new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></td>
                      <td className="p-4 font-medium text-gray-800">{order.customerName}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded border ${order.type === 'pos' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {order.type === 'pos' ? 'PDV / Loja' : 'Online / Whats'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{order.items.reduce((acc, i) => acc + i.quantity, 0)} itens</td>
                      <td className="p-4 font-bold text-iza-green">R$ {order.total.toFixed(2)}</td>
                      <td className="p-4 text-gray-600 text-xs">{order.paymentMethod}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 text-right">
                         <div className="flex justify-end gap-2">
                            {order.status === 'pending' && (
                              <button onClick={() => handleStatusChange(order, 'completed')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Marcar como Concluído">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {order.status !== 'cancelled' && (
                              <button onClick={() => handleStatusChange(order, 'cancelled')} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Cancelar Venda">
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handlePrint(order)} 
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="Imprimir Recibo"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSales;