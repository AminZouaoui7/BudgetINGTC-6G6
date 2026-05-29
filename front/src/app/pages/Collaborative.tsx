
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Send,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { useEffect, useState } from "react";
import type { Budget, Transaction, User, Comment, Category } from "../types";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { transactionService } from "../../services/transactionService";
import { budgetService } from "../../services/budgetService";
import { commentService } from "../../services/commentService";
import { categoryService } from "../../services/categoryService";
import { userService } from "../../services/userService";
import { getApiErrorMessage } from "../../services/api";

export function Collaborative() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgetTransactions, setBudgetTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionComments, setTransactionComments] = useState<
    Record<number, Comment[]>
  >({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [addingCommentTo, setAddingCommentTo] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const { user, isAdmin } = useAuth();

  const loadCollaborativeData = async () => {
    try {
      setIsLoading(true);
      const transactions = await transactionService.getAll();
      const fetchedCategories = await categoryService.getAll();
      const fetchedBudgets = await budgetService.getAll(transactions);
      const fetchedUsers = await userService.getAll();
      const sharedBudgets = fetchedBudgets.filter(
        (budget) =>
          budget.isShared &&
          (budget.ownerId === user?.id ||
            budget.members?.some((m) => m.id === user?.id))
      );
      setBudgets(sharedBudgets);
      setCategories(fetchedCategories);
      setUsers(fetchedUsers);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loadBudgetTransactions = async (budget: Budget) => {
    try {
      setIsTransactionsLoading(true);
      const transactions = await transactionService.getByBudget(budget.id);
      setBudgetTransactions(transactions);
      setSelectedBudget(budget);
      setTransactionComments({});
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  const loadTransactionComments = async (transactionId: number) => {
    try {
      const comments = await commentService.getByTransaction(transactionId);
      setTransactionComments((prev) => ({
        ...prev,
        [transactionId]: comments,
      }));
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleAddMember = async () => {
    if (!selectedBudget || !inviteEmail.trim()) return;
    try {
      setIsInviting(true);
      await budgetService.addMember(selectedBudget.id, {
        email: inviteEmail.trim(),
        role: "member",
      });
      toast.success("Membre invité avec succès");
      setIsInviteModalOpen(false);
      setInviteEmail("");
      await loadCollaborativeData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedBudget) return;
    const confirm = window.confirm(
      "Êtes-vous sûr de vouloir retirer ce membre du budget ?"
    );
    if (!confirm) return;
    try {
      await budgetService.removeMember(selectedBudget.id, userId);
      toast.success("Membre retiré avec succès");
      await loadCollaborativeData();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleAddComment = async () => {
    if (!addingCommentTo || !commentInput.trim()) return;
    try {
      await commentService.create({
        content: commentInput.trim(),
        transactionId: addingCommentTo,
      });
      toast.success("Commentaire ajouté");
      setCommentInput("");
      setAddingCommentTo(null);
      await loadTransactionComments(addingCommentTo);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    loadCollaborativeData();
  }, []);

  const isOwnerOrAdmin =
    selectedBudget &&
    (isAdmin || selectedBudget.ownerId === user?.id);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center text-gray-500">
          <Loader2 className="w-10 h-10 mx-auto mb-4 text-[#0879bf] animate-spin" />
          Chargement des budgets collaboratifs...
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Espace collaboratif</h1>
        <p className="text-gray-500">Gérez vos budgets partagés et collaborez en équipe</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - budgets list */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Budgets partagés</h3>
          {budgets.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              Aucun budget partagé trouvé
            </Card>
          ) : (
            budgets.map((budget) => {
              const percentage = Math.min(
                (budget.spent / budget.amount) * 100,
                100
              );
              return (
                <Card
                  key={budget.id}
                  hover
                  role="button"
                  tabIndex={0}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedBudget?.id === budget.id
                      ? "ring-2 ring-[#0879bf] bg-[#f0f8ff]"
                      : ""
                  }`}
                  onClick={() => {
                    console.log("budget clicked", budget);
                    setSelectedBudget(budget);
                    loadBudgetTransactions(budget);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      console.log("budget selected via enter", budget);
                      setSelectedBudget(budget);
                      loadBudgetTransactions(budget);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.color }}
                      />
                      <h4 className="font-semibold text-gray-900">{budget.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {budget.spent.toLocaleString()}€ /{" "}
                    {budget.amount.toLocaleString()}€
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: budget.color,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {budget.members?.length || 0} membre(s)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("button clicked", budget);
                        setSelectedBudget(budget);
                        loadBudgetTransactions(budget);
                      }}
                    >
                      Voir détails
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Middle + Right columns - selected budget details */}
        {selectedBudget ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Budget details header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: selectedBudget.color }}
                    />
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedBudget.name}
                    </h2>
                  </div>
                  {selectedBudget.owner && (
                    <p className="text-sm text-gray-500">
                      Propriétaire : {selectedBudget.owner.fullName}
                    </p>
                  )}
                </div>
                {isOwnerOrAdmin && (
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setIsInviteModalOpen(true)}
                  >
                    Inviter un membre
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#f0f8ff] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Plafond</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedBudget.amount.toLocaleString()}€
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Dépenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    {selectedBudget.spent.toLocaleString()}€
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Restant</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(selectedBudget.amount - selectedBudget.spent).toLocaleString()}€
                  </p>
                </div>
              </div>
            </Card>

            {/* Members list */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0879bf]" />
                Membres ({selectedBudget.members?.length || 0})
              </h3>
              <div className="space-y-2">
                {selectedBudget.owner && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={selectedBudget.owner.fullName}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedBudget.owner.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedBudget.owner.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="primary">Propriétaire</Badge>
                  </div>
                )}
                {selectedBudget.members
                  ?.filter((m) => m.id !== selectedBudget.ownerId)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={member.fullName} size="md" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="info">Membre</Badge>
                        {isOwnerOrAdmin && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Transactions */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Transactions ({budgetTransactions.length})
              </h3>
              {isTransactionsLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 text-[#0879bf] animate-spin" />
                  Chargement des transactions...
                </div>
              ) : budgetTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucune transaction pour ce budget
                </div>
              ) : (
                <div className="space-y-4">
                  {budgetTransactions.map((transaction) => {
                    const comments =
                      transactionComments[transaction.id] || [];
                    return (
                      <div
                        key={transaction.id}
                        className="p-4 border border-gray-100 rounded-lg bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {transaction.description}
                              </p>
                              <Badge
                                variant={
                                  transaction.type === "income"
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {transaction.type === "income"
                                  ? "Revenu"
                                  : "Dépense"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString("fr-FR")}{" "}
                              • {transaction.author?.fullName || "Auteur inconnu"}
                            </p>
                            {transaction.category && (
                              <p className="text-xs text-gray-400">
                                {transaction.category.name}
                              </p>
                            )}
                          </div>
                          <p
                            className={`text-xl font-bold ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {transaction.amount.toLocaleString()}€
                          </p>
                        </div>

                        {/* Comments section */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!transactionComments[transaction.id]) {
                                  loadTransactionComments(transaction.id);
                                }
                                setAddingCommentTo(
                                  addingCommentTo === transaction.id
                                    ? null
                                    : transaction.id
                                );
                              }}
                              className="text-xs text-[#0879bf] hover:underline flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              {comments.length} commentaire(s)
                            </button>
                          </div>

                          {addingCommentTo === transaction.id && (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={commentInput}
                                  onChange={(e) =>
                                    setCommentInput(e.target.value)
                                  }
                                  placeholder="Écrire un commentaire..."
                                  className="flex-1"
                                />
                                <Button
                                  variant="primary"
                                  icon={
                                    <Send className="w-4 h-4" />
                                  }
                                  onClick={handleAddComment}
                                >
                                  Envoyer
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="bg-gray-50 p-3 rounded-lg"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-xs font-medium text-gray-900">
                                        {comment.author?.fullName ||
                                          "Auteur inconnu"}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {comment.createdAt
                                          ? new Date(
                                              comment.createdAt
                                            ).toLocaleString("fr-FR")
                                          : ""}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                      {comment.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <Card className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez un budget partagé pour voir les détails</p>
            </Card>
          </div>
        )}
      </div>

      {/* Invite member modal */}
      {selectedBudget && (
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title={`Inviter un membre - ${selectedBudget.name}`}
          footer={
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsInviteModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleAddMember}
                disabled={isInviting || !inviteEmail.trim()}
                icon={
                  isInviting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : undefined
                }
              >
                {isInviting ? "Invitation en cours..." : "Inviter"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Ou saisissez un e-mail"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="ex: collègue@entreprise.com"
            />
            <p className="text-xs text-gray-500">
              Ou sélectionnez un utilisateur dans la liste ci-dessous
            </p>
            
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {(() => {
                const existingMemberIds = [
                  selectedBudget.ownerId,
                  ...(selectedBudget.members?.map(m => m.id) || [])
                ];
                const availableUsers = users.filter(u => !existingMemberIds.includes(u.id));
                
                if (availableUsers.length === 0) {
                  return (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Tous les utilisateurs sont déjà membres
                    </div>
                  );
                }
                
                return availableUsers.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                    onClick={() => setInviteEmail(u.email)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={u.fullName} size="md" />
                      <div>
                        <p className="font-medium text-gray-900">{u.fullName}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    {inviteEmail === u.email && (
                      <div className="w-4 h-4 rounded-full bg-[#0879bf] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

