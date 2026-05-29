import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import type { Budget, Category, Transaction } from '../types';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';
import { transactionService } from '../../services/transactionService';
import { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../context/AuthContext';

function formatCurrency(value: number) {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}€`;
}

function formatMonthLabel(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short' });
}

export function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [fetchedCategories, rawTransactions] = await Promise.all([
          categoryService.getAll(),
          transactionService.getAll(),
        ]);

        const mappedTransactions = rawTransactions.map((transaction) => ({
          ...transaction,
          category:
            fetchedCategories.find((category) => category.id === transaction.categoryId) ?? null,
        }));

        const fetchedBudgets = await budgetService.getAll(mappedTransactions);

        setCategories(fetchedCategories);
        setTransactions(mappedTransactions);
        setBudgets(fetchedBudgets);
      } catch (loadError) {
        setError(getApiErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
    const totalExpenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
    const budgetUsed = budgets.reduce((total, budget) => total + budget.spent, 0);
    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const balance = totalIncome - totalExpenses;
    const budgetRemaining = totalBudget - budgetUsed;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      budgetUsed,
      budgetRemaining,
      balance,
      savingsRate,
    };
  }, [budgets, transactions]);

  const monthlyData = useMemo(() => {
    const buckets = new Map<string, { month: string; revenus: number; depenses: number }>();

    transactions.forEach((transaction) => {
      const key = transaction.date.slice(0, 7);
      const current = buckets.get(key) ?? {
        month: formatMonthLabel(transaction.date),
        revenus: 0,
        depenses: 0,
      };

      if (transaction.type === 'income') {
        current.revenus += transaction.amount;
      } else {
        current.depenses += transaction.amount;
      }

      buckets.set(key, current);
    });

    return Array.from(buckets.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .slice(-6)
      .map(([, value]) => value);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const totals = new Map<number, { name: string; value: number; color: string }>();

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const category = transaction.category ?? categories.find((item) => item.id === transaction.categoryId);
        const key = category?.id ?? 0;
        const current = totals.get(key) ?? {
          name: category?.name ?? 'Sans categorie',
          value: 0,
          color: category?.color ?? '#3eb3f2',
        };

        current.value += transaction.amount;
        totals.set(key, current);
      });

    return Array.from(totals.values()).sort((left, right) => right.value - left.value);
  }, [categories, transactions]);

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
        .slice(0, 5),
    [transactions],
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-gray-500">Chargement du tableau de bord...</Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Impossible de charger le dashboard</h2>
          <p className="text-gray-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenus totaux"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        />
        <StatsCard
          title="Depenses totales"
          value={formatCurrency(stats.totalExpenses)}
          icon={<TrendingDown className="w-6 h-6" />}
          color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        />
        <StatsCard
          title="Solde"
          value={formatCurrency(stats.balance)}
          icon={<Wallet className="w-6 h-6" />}
          color="linear-gradient(135deg, #3eb3f2 0%, #0879bf 100%)"
        />
        <StatsCard
          title="Budget consomme"
          value={`${Math.max(0, stats.totalExpenses ? (stats.budgetUsed / Math.max(budgets.reduce((total, budget) => total + budget.amount, 0), 1)) * 100 : 0).toFixed(0)}%`}
          icon={<PiggyBank className="w-6 h-6" />}
          trend={{ value: Number(stats.savingsRate.toFixed(1)), isPositive: stats.savingsRate >= 0 }}
          color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Evolution des depenses dans le temps</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bce3fb" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #bce3fb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="depenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Depenses par categorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Transactions recentes</h3>
            <Badge variant="info">{recentTransactions.length} elements</Badge>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const color = transaction.category?.color ?? '#3eb3f2';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f0f8ff] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5" style={{ color }} />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" style={{ color }} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description || 'Transaction'}</p>
                      <p className="text-xs text-gray-500">{transaction.category?.name ?? 'Sans categorie'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Budgets actifs</h3>
            <Badge variant="info">{budgets.length} budgets</Badge>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 4).map((budget) => {
              const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
              const variant = percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : 'success';

              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: budget.color }} />
                      <span className="text-sm font-medium text-gray-900">{budget.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        variant === 'danger' ? 'bg-red-500' :
                        variant === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Activite recente</h3>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={`activity-${transaction.id}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f0f8ff] transition-colors">
              <Avatar name={user?.fullName || 'Utilisateur'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{user?.fullName || 'Utilisateur'}</span>
                  <span className="text-gray-600"> a enregistre {transaction.description || 'une transaction'}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.type === 'income' ? 'Revenu' : 'Depense'} dans {transaction.category?.name ?? 'Sans categorie'}
                </p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
