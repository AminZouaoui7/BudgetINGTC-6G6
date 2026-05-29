import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'

import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import type { Category, Comment, Transaction, TransactionType } from '../types'
import { categoryService } from '../../services/categoryService'
import { commentService } from '../../services/commentService'
import { transactionService } from '../../services/transactionService'
import { getApiErrorMessage } from '../../services/api'
import { toast } from 'sonner'

type FormState = {
  description: string
  amount: string
  type: TransactionType
  categoryId: string
  date: string
}

function getDefaultFormState(): FormState {
  return {
    description: '',
    amount: '',
    type: 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  };
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState<FormState>(getDefaultFormState())

  const getCategoryById = (id?: number | null) =>
    categories.find((category) => category.id === id) ?? null

  const hydrateTransaction = (transaction: Transaction): Transaction => ({
    ...transaction,
    category: transaction.category ?? getCategoryById(transaction.categoryId),
  })

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedTransactions = await transactionService.getAll()
      setTransactions(fetchedTransactions.map(hydrateTransaction))
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAll()
      setCategories(fetchedCategories)
    } catch (loadError) {
      toast.error(getApiErrorMessage(loadError))
    }
  }

  const loadComments = async (transactionId: number) => {
    try {
      setIsCommentsLoading(true)
      const fetchedComments = await commentService.getByTransaction(transactionId)
      setComments(fetchedComments)
    } catch (loadError) {
      toast.error(getApiErrorMessage(loadError))
    } finally {
      setIsCommentsLoading(false)
    }
  }

  useEffect(() => {
    void Promise.all([loadTransactions(), loadCategories()])
  }, [])

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === formData.type),
    [formData.type, categories],
  )

  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => filterType === 'all' || transaction.type === filterType)
        .filter((transaction) => {
          const categoryName = transaction.category?.name ?? '';
          const authorName = transaction.author?.fullName ?? '';
          return `${transaction.description} ${categoryName} ${authorName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }),
    [filterType, searchTerm, transactions],
  )

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpense = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

  const resetForm = () => {
    setEditingTransaction(null)
    setFormData(getDefaultFormState())
    setComments([])
    setCommentInput('')
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = async (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      description: transaction.description ?? '',
      amount: String(transaction.amount),
      type: transaction.type,
      categoryId: transaction.categoryId != null ? String(transaction.categoryId) : '',
      date: transaction.date,
    })
    setIsModalOpen(true)
    await loadComments(transaction.id)
  }

  const saveTransaction = async (transactionId?: number) => {
    const payload = {
      description: formData.description,
      amount: Number(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      date: formData.date,
    };

    try {
      if (transactionId) {
        await transactionService.update(transactionId, payload);
      } else {
        await transactionService.create(payload);
      }
    } catch (saveError: any) {
      if (saveError?.response?.status === 403 && payload.categoryId !== null) {
        const fallbackPayload = { ...payload, categoryId: null };
        if (transactionId) {
          await transactionService.update(transactionId, fallbackPayload);
        } else {
          await transactionService.create(fallbackPayload);
        }
        toast.success('Transaction enregistrée sans catégorie');
        return;
      }

      throw saveError;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      await saveTransaction(editingTransaction?.id)
      await Promise.all([loadTransactions(), loadCategories()])
      setIsModalOpen(false)
      resetForm()
      toast.success(editingTransaction ? 'Transaction modifiée' : 'Transaction ajoutée')
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (transactionId: number) => {
    try {
      await transactionService.remove(transactionId)
      await loadTransactions()
      toast.success('Transaction supprimée')
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError))
    }
  }

  const handleCommentSubmit = async () => {
    if (!editingTransaction) {
      return
    }

    if (!commentInput.trim()) {
      toast.error('Le commentaire ne peut pas être vide.')
      return
    }

    try {
      await commentService.create({
        content: commentInput.trim(),
        transactionId: editingTransaction.id,
      })
      setCommentInput('')
      await loadComments(editingTransaction.id)
      toast.success('Commentaire ajouté')
    } catch (commentError) {
      toast.error(getApiErrorMessage(commentError))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">Gérez toutes vos transactions</p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={openCreateModal}
        >
          Ajouter une transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total revenus</p>
              <p className="text-2xl font-bold text-green-600">
                +{totalIncome.toLocaleString()}€
              </p>
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
              <p className="text-2xl font-bold text-red-600">
                -{totalExpense.toLocaleString()}€
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {(totalIncome - totalExpense).toLocaleString()}€
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-4 border-blue-600" />
            </div>
          </div>
        </Card>
      </div>

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

          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            size="sm"
          >
            Exporter
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 flex items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chargement des transactions...</span>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <p className="font-medium text-red-600 mb-2">Impossible de charger les transactions</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-900 mb-2">Aucune transaction</p>
              <p className="text-sm text-gray-500">
                Ajoutez une transaction ou modifiez vos filtres pour en afficher.
              </p>
            </div>
          ) : (
          <table className="w-full">
            <thead className="bg-[#f0f8ff] border-b border-[#bce3fb]/30">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Catégorie
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Auteur
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Type
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                  Montant
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => {
                const category = transaction.category ?? getCategoryById(transaction.categoryId)

                return (
                  <tr
                    key={transaction.id}
                    className="hover:bg-[#f0f8ff]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {category ? (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${category.color}15`,
                            color: category.color,
                          }}
                        >
                          {category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Sans catégorie
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.author?.fullName ?? 'Moi'}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          transaction.type === 'income' ? 'success' : 'danger'
                        }
                      >
                        {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                      </Badge>
                    </td>

                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount.toLocaleString()}€
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(transaction)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(transaction.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>

            <Button
              variant="primary"
              type="submit"
              form="transaction-form"
              disabled={isSaving}
              icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {editingTransaction ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        }
      >
        <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description"
            placeholder="Ex: Courses du mois"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Input
            label="Montant (€)"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'expense',
                    categoryId: '',
                  })
                }
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
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'income',
                    categoryId: '',
                  })
                }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>

            <select
              className="w-full px-4 py-2.5 bg-white border border-[#bce3fb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#81cdf8]"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Sans catégorie</option>
              {filteredCategories
                .filter((c) => c.type === formData.type)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          {editingTransaction && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Commentaires</h3>
                <span className="text-xs text-gray-500">{comments.length} commentaire(s)</span>
              </div>

              {isCommentsLoading ? (
                <div className="text-sm text-gray-500">Chargement des commentaires...</div>
              ) : comments.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun commentaire pour cette transaction.</div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {comment.author?.fullName ?? 'Utilisateur'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString('fr-FR') : ''}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <Input
                  label="Ajouter un commentaire"
                  placeholder="Tapez votre commentaire"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isCommentsLoading}
                  onClick={handleCommentSubmit}
                >
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
