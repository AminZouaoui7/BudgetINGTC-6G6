import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Edit,
  Trash2,
  Loader2,
  Wallet,
  Briefcase,
  Car,
  Home,
  Gamepad2,
  Heart,
} from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../../services/categoryService';
import { getApiErrorMessage } from '../../services/api';
import type { Category as CategoryType } from '../types';

const colors = [
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#14b8a6',
  '#6366f1',
];

const icons = [
  'Wallet',
  'Briefcase',
  'TrendingUp',
  'ShoppingCart',
  'Car',
  'Home',
  'Gamepad2',
  'Heart',
  'CreditCard',
];

const IconComponents = {
  Wallet,
  Briefcase,
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Gamepad2,
  Heart,
  CreditCard,
};

const normalizeCategory = (category: CategoryType): Required<CategoryType> => {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? '',
    userId: category.userId ?? 0,
    color: category.color ?? '#3eb3f2',
    icon: category.icon ?? 'ShoppingCart',
    type: category.type ?? 'expense',
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

export const Categories = () => {
  const [categories, setCategories] = useState<Required<CategoryType>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Required<CategoryType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3eb3f2',
    icon: 'ShoppingCart',
    type: 'expense' as 'income' | 'expense',
  });

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data.map(normalizeCategory));
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === 'income'),
    [categories]
  );

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories]
  );

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3eb3f2',
      icon: 'ShoppingCart',
      type: 'expense',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category: Required<CategoryType>) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description ?? '',
      color: category.color,
      icon: category.icon,
      type: category.type,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const payload = {
        name: formData.name,
        note: formData.description,
        color: formData.color,
        icon: formData.icon,
        type: formData.type,
      };

      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
      } else {
        await categoryService.create(payload);
      }

      toast.success(editingCategory ? 'Catégorie modifiée' : 'Catégorie créée');

      setIsModalOpen(false);
      resetForm();
      await loadCategories();
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    const confirmDelete = window.confirm(
      'Voulez-vous vraiment supprimer cette catégorie ?'
    );
    if (!confirmDelete) return;

    try {
      await categoryService.remove(categoryId);

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId)
      );
      toast.success('Catégorie supprimée');
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  const renderCategoryCard = (category: Required<CategoryType>) => {
    const IconComponent = IconComponents[category.icon as keyof typeof IconComponents] || ShoppingCart;
    return (
      <Card key={category.id} hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <IconComponent className="w-6 h-6" style={{ color: category.color }} />
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openEditModal(category)}
                className="p-1 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                className="p-1 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>

        {category.description && (
          <p className="text-sm text-gray-500 mb-3">{category.description}</p>
        )}

        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-xs text-gray-500">
            {category.type === 'income'
              ? 'Catégorie de revenu'
              : 'Catégorie de dépense'}
          </span>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-gray-500">
          Chargement des catégories...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Impossible de charger les catégories
          </h2>
          <p className="text-gray-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-500">
            Organisez vos transactions par catégories
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Nouvelle catégorie
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Revenus</h2>
          <Badge variant="success">{incomeCategories.length}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {incomeCategories.length === 0 ? (
            <Card className="p-6 text-gray-500">
              Aucune catégorie de revenu.
            </Card>
          ) : (
            incomeCategories.map(renderCategoryCard)
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Dépenses</h2>
          <Badge variant="danger">{expenseCategories.length}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {expenseCategories.length === 0 ? (
            <Card className="p-6 text-gray-500">
              Aucune catégorie de dépense.
            </Card>
          ) : (
            expenseCategories.map(renderCategoryCard)
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingCategory ? 'Modifier une catégorie' : 'Nouvelle catégorie'
        }
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>

            <Button
              variant="primary"
              type="submit"
              form="category-form"
              disabled={isSaving}
              icon={
                isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : undefined
              }
            >
              {editingCategory ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom de la catégorie"
            placeholder="Ex: Courses"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <Input
            label="Description"
            placeholder="Description optionnelle"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type visuel
            </label>

            <div className="flex gap-3">
              <button
                type="button"
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
                type="button"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>

            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-[#0879bf]'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône
            </label>

            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => {
                const Icon = IconComponents[icon as keyof typeof IconComponents];
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center ${
                      formData.icon === icon
                        ? 'border-[#0879bf] bg-[#f0f8ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
