import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Search, Image as ImageIcon } from 'lucide-react';
import { Product, Category, ProductDetails } from '../../types';
import { CATEGORIES } from '../../constants';
import { getProducts, saveProduct, deleteProduct } from '../../services/storageService';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Empty State for Form
  const initialFormState: Product = {
    id: '',
    code: '',
    name: '',
    description: '',
    category: 'Plantas',
    subCategory: '',
    costPrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 5,
    unit: 'un',
    status: 'active',
    image: '',
    details: {},
    createdAt: ''
  };

  const [formData, setFormData] = useState<Product>(initialFormState);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave = {
      ...formData,
      id: formData.id || Date.now().toString(),
      createdAt: formData.createdAt || new Date().toISOString()
    };
    saveProduct(productToSave);
    setProducts(getProducts());
    setIsEditing(false);
    setFormData(initialFormState);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic Fields Component based on Category
  const renderCategoryFields = () => {
    switch(formData.category) {
      case 'Plantas':
        return (
          <>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Nome Científico</label>
                <input type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.scientificName || ''} onChange={e => setFormData({...formData, details: {...formData.details, scientificName: e.target.value}})} />
             </div>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Necessidade de Sol</label>
                <select className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.sunNeeds || ''} onChange={e => setFormData({...formData, details: {...formData.details, sunNeeds: e.target.value as any}})}>
                  <option value="Sol Pleno">Sol Pleno</option>
                  <option value="Meia Sombra">Meia Sombra</option>
                  <option value="Sombra">Sombra</option>
                </select>
             </div>
             <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Rega / Cuidados</label>
                <textarea className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.wateringFreq || ''} onChange={e => setFormData({...formData, details: {...formData.details, wateringFreq: e.target.value}})} placeholder="Ex: 2x por semana..." />
             </div>
          </>
        );
      case 'Vasos':
        return (
          <>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <input type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.material || ''} onChange={e => setFormData({...formData, details: {...formData.details, material: e.target.value}})} />
             </div>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Dimensões (AxL)</label>
                <input type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.dimensions || ''} onChange={e => setFormData({...formData, details: {...formData.details, dimensions: e.target.value}})} />
             </div>
          </>
        );
      case 'Terra':
      case 'Substrato':
        return (
          <>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">pH</label>
                <input type="number" step="0.1" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.ph || ''} onChange={e => setFormData({...formData, details: {...formData.details, ph: parseFloat(e.target.value)}})} />
             </div>
             <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Composição</label>
                <input type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.details.composition || ''} onChange={e => setFormData({...formData, details: {...formData.details, composition: e.target.value}})} />
             </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h2>
        <button 
          onClick={() => { setIsEditing(true); setFormData(initialFormState); }}
          className="bg-iza-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#255a32]"
        >
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold text-gray-700">{formData.id ? 'Editar Produto' : 'Novo Produto'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Image Upload */}
            <div className="col-span-1 row-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
               <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center relative overflow-hidden bg-gray-50">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <span>Upload Imagem (Max 2MB)</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </div>

            {/* Basic Info */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Código</label>
              <input required type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input required type="text" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Price & Stock */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Preço Custo (R$)</label>
              <input type="number" step="0.01" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Preço Venda (R$)</label>
              <input required type="number" step="0.01" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Estoque Atual</label>
              <input required type="number" className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select className="mt-1 w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:border-iza-green outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="order">Sob Encomenda</option>
                <option value="discontinued">Descontinuado</option>
              </select>
            </div>

             {/* Dynamic Fields */}
             {renderCategoryFields()}

            <div className="col-span-full mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-iza-green text-white rounded hover:bg-[#255a32] flex items-center gap-2">
                <Save className="w-4 h-4" /> Salvar Produto
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
             <div className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Buscar por nome ou código..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-iza-green"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                <tr>
                  <th className="p-4">Img</th>
                  <th className="p-4">Código</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Estoque</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img src={p.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                    </td>
                    <td className="p-4 text-gray-500">{p.code}</td>
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-iza-mint/30 text-iza-green rounded-full text-xs">{p.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={p.stock <= p.minStock ? 'text-red-500 font-bold' : 'text-gray-700'}>{p.stock}</span>
                    </td>
                    <td className="p-4">R$ {p.salePrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${p.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {p.status === 'active' ? 'Ativo' : 'Inativo'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;