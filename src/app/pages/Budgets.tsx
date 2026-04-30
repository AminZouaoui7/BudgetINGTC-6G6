import { useState } from 'react';
import { Plus, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { budgets, categories } from '../data/mockData';

export function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    categoryId: categories[3].id,
    period: 'monthly'
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500">Suivez et gérez vos budgets</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Créer un budget
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Budgets actifs</p>
              <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Budgets partagés</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.filter(b => b.isShared).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgets.filter(b => (b.spent / b.amount) > 0.8).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 80 && !isOverBudget;

          return (
            <Card key={budget.id} hover className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${budget.category.color}15` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                  </div>
                </div>
                {isOverBudget && (
                  <Badge variant="danger">
                    <AlertTriangle className="w-3 h-3" />
                  </Badge>
                )}
                {isNearLimit && (
                  <Badge variant="warning">
                    <AlertTriangle className="w-3 h-3" />
                  </Badge>
                )}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Dépensé</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverBudget ? 'bg-red-500' :
                      isNearLimit ? 'bg-yellow-500' : 'bg-gradient-to-r from-[#3eb3f2] to-[#0879bf]'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {budget.spent.toLocaleString()}€
                  </span>
                  <span className="text-sm text-gray-500">
                    sur {budget.amount.toLocaleString()}€
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
                  {isOverBudget ? (
                    <>Dépassé de {(budget.spent - budget.amount).toLocaleString()}€</>
                  ) : (
                    <>Reste {(budget.amount - budget.spent).toLocaleString()}€</>
                  )}
                </p>
              </div>

              {/* Members */}
              {budget.isShared && budget.members && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Partagé</span>
                    </div>
                    <div className="flex -space-x-2">
                      {budget.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} name={member.name} size="sm" />
                      ))}
                      {budget.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{budget.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Create Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un budget"
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
            label="Nom du budget"
            placeholder="Ex: Alimentation mensuelle"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Montant maximum (€)"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.filter(c => c.type === 'expense').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            >
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
