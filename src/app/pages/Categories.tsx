import { useState } from 'react';
import { Plus, ShoppingCart, Car, Home, Gamepad2, Heart, CreditCard, Wallet, Briefcase, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { categories } from '../data/mockData';

const iconMap: Record<string, any> = {
  ShoppingCart, Car, Home, Gamepad2, Heart, CreditCard, Wallet, Briefcase, TrendingUp
};

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3eb3f2',
    type: 'expense'
  });

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-500">Organisez vos transactions par catégories</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Nouvelle catégorie
        </Button>
      </div>

      {/* Income Categories */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Revenus</h2>
          <Badge variant="success">{incomeCategories.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {incomeCategories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Card key={category.id} hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    {Icon && <Icon className="w-6 h-6" style={{ color: category.color }} />}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-500">Catégorie de revenu</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Dépenses</h2>
          <Badge variant="danger">{expenseCategories.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {expenseCategories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Card key={category.id} hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    {Icon && <Icon className="w-6 h-6" style={{ color: category.color }} />}
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-500">Catégorie de dépense</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nouvelle catégorie"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Créer
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nom de la catégorie"
            placeholder="Ex: Courses"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
            <div className="grid grid-cols-6 gap-2">
              {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#6366f1'].map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-[#0879bf]' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
