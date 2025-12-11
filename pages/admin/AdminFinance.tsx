import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Plus, Filter, Trash2, Calendar } from 'lucide-react';
import { getFinance, saveFinanceEntry, deleteFinanceEntry } from '../../services/storageService';
import { FinanceEntry } from '../../types';

const AdminFinance = () => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Form State
  const initialFormState: Partial<FinanceEntry> = {
    type: 'expense',
    description: '',
    amount: 0,
    category: 'Geral',
    status: 'paid',
    date: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Sort by date descending
    const data = getFinance().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(data);
  };

  const calculateTotals = () => {
    const income = entries.filter(e => e.type === 'income').reduce((acc, e) => acc + e.amount, 0);
    const expense = entries.filter(e => e.type === 'expense').reduce((acc, e) => acc + e.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const { income, expense, balance } = calculateTotals();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: FinanceEntry = {
      id: Date.now().toString(),
      type: formData.type as 'income' | 'expense',
      description: formData.description || '',
      amount: Number(formData.amount),
      category: formData.category || 'Geral',
      status: formData.status as 'paid' | 'pending',
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };
    
    saveFinanceEntry(entry);
    refreshData();
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este lançamento?')) {
      deleteFinanceEntry(id);
      refreshData();
    }
  };

  const filteredEntries = filterType === 'all' ? entries : entries.filter(e => e.type === filterType);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financeiro</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-iza-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#255a32] shadow-md"
        >
          <Plus className="w-5 h-5" /> Novo Lançamento
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Saldo Total</p>
            <h3 className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}>
              R$ {balance.toFixed(2)}
            </h3>
          </div>
          <div className={`p-4 rounded-full ${balance >= 0 ? 'bg-iza-mint/30 text-iza-green' : 'bg-red-100 text-red-500'}`}>
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Entradas</p>
            <h3 className="text-3xl font-bold text-green-600">R$ {income.toFixed(2)}</h3>
          </div>
          <div className="p-4 rounded-full bg-green-100 text-green-600">
            <ArrowUpCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase mb-1">Saídas</p>
            <h3 className="text-3xl font-bold text-red-500">R$ {expense.toFixed(2)}</h3>
          </div>
          <div className="p-4 rounded-full bg-red-100 text-red-500">
            <ArrowDownCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
          <button 
             onClick={() => setFilterType('all')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${filterType === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todas
          </button>
          <button 
             onClick={() => setFilterType('income')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${filterType === 'income' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
          >
            Entradas
          </button>
          <button 
             onClick={() => setFilterType('expense')}
             className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${filterType === 'expense' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
          >
            Saídas
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Valor</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredEntries.length === 0 ? (
                <tr>
                   <td colSpan={6} className="p-8 text-center text-gray-400">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50 group">
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-gray-400" />
                         {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{entry.description}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{entry.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${entry.status === 'paid' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {entry.status === 'paid' ? 'Pago / Recebido' : 'Pendente'}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                      {entry.type === 'income' ? '+' : '-'} R$ {entry.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(entry.id)} 
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Excluir Lançamento"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Novo Lançamento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                    <select 
                      className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="income">Entrada (Receita)</option>
                      <option value="expense">Saída (Despesa)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                    <input 
                      type="date"
                      className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      required
                    />
                 </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Conta de Luz, Venda avulsa..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                   <input 
                     type="number" step="0.01"
                     className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                     value={formData.amount}
                     onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                     required
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                   <select 
                     className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                   >
                     <option value="Geral">Geral</option>
                     <option value="Vendas">Vendas</option>
                     <option value="Fornecedores">Fornecedores</option>
                     <option value="Operacional">Operacional</option>
                     <option value="Marketing">Marketing</option>
                     <option value="Pessoal">Pessoal</option>
                   </select>
                </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                 <select 
                   className="w-full p-2 border border-black bg-white text-gray-900 rounded focus:border-iza-green outline-none"
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value as any})}
                 >
                   <option value="paid">Pago / Recebido</option>
                   <option value="pending">Pendente</option>
                 </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-iza-green text-white rounded hover:bg-[#255a32]">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinance;