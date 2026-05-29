import { useEffect, useMemo, useState } from 'react';
import { Plus, Users, Calendar, TrendingUp, AlertTriangle, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import type { Budget, Transaction, User } from '../types';
import { budgetService } from '../../services/budgetService';
import { transactionService } from '../../services/transactionService';
import { getApiErrorMessage } from '../../services/api';
import { toast } from 'sonner';

function formatCurrency(value: number) {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}€`;
}

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMemberSaving, setIsMemberSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
    periodType: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isShared: false,
  });
  const { user } = useAuth();

  const refreshBudgets = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const fetchedTransactions = await transactionService.getAll()
      const fetchedBudgets = await budgetService.getAll(fetchedTransactions)

      setTransactions(fetchedTransactions)
      setBudgets(fetchedBudgets)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshBudgets()
  }, [])

  const openMembersModal = (budget: Budget) => {
    setSelectedBudget(budget)
    setMemberEmail('')
    setIsMemberModalOpen(true)
  }

  const closeMembersModal = () => {
    setSelectedBudget(null)
    setMemberEmail('')
    setIsMemberModalOpen(false)
  }

  const resetForm = () => {
    setEditingBudget(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      name: '',
      amount: '',
      description: '',
      periodType: 'monthly',
      startDate: today,
      endDate: today,
      isShared: false,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      amount: String(budget.amount),
      description: budget.description ?? '',
      periodType: budget.periodType,
      startDate: budget.startDate,
      endDate: budget.endDate,
      isShared: budget.isShared,
    });
    setIsModalOpen(true);
  };

  const handleAddMember = async () => {
    if (!selectedBudget) {
      return;
    }

    if (!memberEmail.trim()) {
      toast.error('Veuillez saisir l’adresse e-mail du membre.');
      return;
    }

    try {
      setIsMemberSaving(true);
      await budgetService.addMember(selectedBudget.id, {
        email: memberEmail.trim(),
        role: 'member',
      });
      toast.success('Membre ajouté au budget.');
      await refreshBudgets();
      closeMembersModal();
    } catch (addError) {
      toast.error(getApiErrorMessage(addError));
    } finally {
      setIsMemberSaving(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedBudget) {
      return;
    }

    try {
      setIsMemberSaving(true);
      await budgetService.removeMember(selectedBudget.id, userId);
      toast.success('Membre retiré du budget.');
      await refreshBudgets();
      if (selectedBudget?.members?.length === 1) {
        closeMembersModal();
      }
    } catch (removeError) {
      toast.error(getApiErrorMessage(removeError));
    } finally {
      setIsMemberSaving(false);
    }
  };

  const stats = useMemo(() => {
    const sharedBudgets = budgets.filter((budget) => budget.isShared).length;
    const alerts = budgets.filter((budget) => budget.amount > 0 && budget.spent / budget.amount > 0.8).length;

    return {
      total: budgets.length,
      sharedBudgets,
      alerts,
    };
  }, [budgets]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const payload = {
        name: formData.name,
        amount: Number(formData.amount),
        description: formData.description,
        periodType: formData.periodType as 'weekly' | 'monthly' | 'yearly',
        startDate: formData.startDate,
        endDate: formData.endDate,
        isShared: formData.isShared,
      };

      if (editingBudget) {
        const updated = await budgetService.update(editingBudget.id, payload);
        const recomputed = { ...updated, spent: editingBudget.spent };
        setBudgets((current) => current.map((budget) => (budget.id === editingBudget.id ? recomputed : budget)));
        toast.success('Budget modifie');
      } else {
        const created = await budgetService.create(payload);
        const recomputed = {
          ...created,
          spent: transactions
            .filter((transaction) => transaction.budgetId === created.id && transaction.type === 'expense')
            .reduce((total, transaction) => total + transaction.amount, 0),
        };
        setBudgets((current) => [recomputed, ...current]);
        toast.success('Budget cree');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (budgetId: number) => {
    try {
      await budgetService.remove(budgetId);
      setBudgets((current) => current.filter((budget) => budget.id !== budgetId));
      toast.success('Budget supprime');
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-gray-500">Chargement des budgets...</Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Impossible de charger les budgets</h2>
          <p className="text-gray-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500">Suivez et gérez vos budgets</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Créer un budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Budgets actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                {stats.sharedBudgets}
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
              <p className="text-2xl font-bold text-gray-900">{stats.alerts}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 80 && !isOverBudget;

          return (
            <Card key={budget.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${budget.color}15` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: budget.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{budget.periodType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                  <button
                    type="button"
                    onClick={() => openEditModal(budget)}
                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(budget.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

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

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-sm text-gray-500">
                    sur {formatCurrency(budget.amount)}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
                  {isOverBudget ? (
                    <>Dépassé de {formatCurrency(budget.spent - budget.amount)}</>
                  ) : (
                    <>Reste {formatCurrency(budget.amount - budget.spent)}</>
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(budget.startDate).toLocaleDateString('fr-FR')} - {new Date(budget.endDate).toLocaleDateString('fr-FR')}</span>
                </div>
                {budget.isShared && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Partagé</span>
                    </div>
                    <Button type="button" variant="outline" size="xs" onClick={() => openMembersModal(budget)}>
                      Membres
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBudget ? "Modifier un budget" : "Créer un budget"}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="budget-form"
              disabled={isSaving}
              icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {editingBudget ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        }
      >
        <form id="budget-form" onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            label="Description"
            placeholder="Description optionnelle du budget"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
              value={formData.periodType}
              onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
            >
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date de début"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Date de fin"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isShared}
              onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
              className="w-4 h-4 rounded border-[#bce3fb] text-[#0879bf] focus:ring-[#81cdf8]"
            />
            <span className="text-sm text-gray-600">Budget partagé</span>
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={isMemberModalOpen}
        onClose={closeMembersModal}
        title={selectedBudget ? `Membres du budget ${selectedBudget.name}` : 'Membres du budget'}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={closeMembersModal}>
              Fermer
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleAddMember}
              disabled={isMemberSaving || !memberEmail.trim()}
            >
              Ajouter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail du membre</label>
            <Input
              placeholder="membre@example.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
          </div>

          {selectedBudget?.owner && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
              <p className="font-medium">Propriétaire :</p>
              <p>{selectedBudget.owner.fullName} • {selectedBudget.owner.email}</p>
            </div>
          )}

          <div className="space-y-3">
            {selectedBudget?.members?.length ? (
              selectedBudget.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3 bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.fullName}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isMemberSaving}
                  >
                    Supprimer
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucun membre partagé pour ce budget.</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
