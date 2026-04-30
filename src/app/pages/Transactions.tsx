import { useState } from 'react';
import { Plus, Search, Filter, Download, Trash2, Edit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { transactions, categories } from '../data/mockData';
import type { Transaction } from '../types';

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: categories[3].id,
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">Gérez toutes vos transactions</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Ajouter une transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total revenus</p>
              <p className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString()}€</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total dépenses</p>
              <p className="text-2xl font-bold text-red-600">-{totalExpense.toLocaleString()}€</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Solde</p>
              <p className="text-2xl font-bold text-gray-900">{(totalIncome - totalExpense).toLocaleString()}€</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-4 border-blue-600"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une transaction..."
              icon={<Search className="w-5 h-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilterType('all')}
              size="sm"
            >
              Toutes
            </Button>
            <Button
              variant={filterType === 'income' ? 'primary' : 'outline'}
              onClick={() => setFilterType('income')}
              size="sm"
            >
              Revenus
            </Button>
            <Button
              variant={filterType === 'expense' ? 'primary' : 'outline'}
              onClick={() => setFilterType('expense')}
              size="sm"
            >
              Dépenses
            </Button>
          </div>
          <Button variant="outline" icon={<Download className="w-4 h-4" />} size="sm">
            Exporter
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f8ff] border-b border-[#bce3fb]/30">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Catégorie</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Montant</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-[#f0f8ff]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${transaction.category.color}15`,
                        color: transaction.category.color
                      }}
                    >
                      {transaction.category.name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={transaction.type === 'income' ? 'success' : 'danger'}>
                      {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                    </Badge>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle transaction"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Description"
            placeholder="Ex: Courses du mois"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Montant (€)"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-[#0879bf] bg-[#f0f8ff]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">Dépense</p>
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-[#0879bf] bg-[#f0f8ff]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-gray-900">Revenu</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories
                .filter(c => c.type === formData.type)
                .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
