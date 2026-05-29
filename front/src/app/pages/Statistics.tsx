import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction, Category } from '../types';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import { getApiErrorMessage } from '../../services/api';

const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

function formatCurrency(value: number) {
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}€`;
}

function getAmount(transaction: Transaction) {
  return Math.abs(Number(transaction.amount || 0));
}

export function Statistics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatistics() {
      try {
        setIsLoading(true);
        setError(null);

        const [fetchedTransactions, fetchedCategories] = await Promise.all([
          transactionService.getAll(),
          categoryService.getAll(),
        ]);

        setTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
      } catch (loadError) {
        setError(getApiErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    }

    void loadStatistics();
  }, []);

  const monthlyComparison = useMemo(() => {
    const now = new Date();

    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
      });

      const revenus = monthTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + getAmount(transaction), 0);

      const dépenses = monthTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + getAmount(transaction), 0);

      return {
        month: monthNames[month],
        revenus,
        dépenses,
        épargne: revenus - dépenses,
      };
    });
  }, [transactions]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === 'expense' &&
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    });
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const totalExpenses = currentMonthExpenses.reduce(
      (sum, transaction) => sum + getAmount(transaction),
      0
    );

    const grouped = currentMonthExpenses.reduce<Record<string, number>>((acc, transaction) => {
      const categoryId = String(transaction.categoryId ?? 'none');
      acc[categoryId] = (acc[categoryId] || 0) + getAmount(transaction);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = categories.find((cat) => String(cat.id) === categoryId);

        return {
          name: category?.name ?? 'Sans catégorie',
          amount,
          color: category?.color ?? '#8b5cf6',
          percentage: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthExpenses, categories]);

  const weeklyTrend = useMemo(() => {
    const now = new Date();

    return [1, 2, 3, 4].map((week) => {
      const amount = currentMonthExpenses
        .filter((transaction) => {
          const day = new Date(transaction.date).getDate();
          return Math.ceil(day / 7) === week;
        })
        .reduce((sum, transaction) => sum + getAmount(transaction), 0);

      return {
        week: `S${week}`,
        montant: amount,
      };
    });
  }, [currentMonthExpenses]);

  const metrics = useMemo(() => {
    const bestMonth = monthlyComparison.reduce(
      (best, current) => (current.épargne > best.épargne ? current : best),
      monthlyComparison[0] ?? { month: '-', revenus: 0, dépenses: 0, épargne: 0 }
    );

    const totalIncome = monthlyComparison.reduce((sum, item) => sum + item.revenus, 0);
    const averageIncome = monthlyComparison.length ? totalIncome / monthlyComparison.length : 0;

    const biggestExpense = currentMonthExpenses.reduce(
      (max, transaction) => (getAmount(transaction) > getAmount(max) ? transaction : max),
      currentMonthExpenses[0]
    );

    const biggestCategory = biggestExpense
      ? categories.find((cat) => cat.id === biggestExpense.categoryId)?.name ?? 'Sans catégorie'
      : '-';

    const totalSavings = monthlyComparison.reduce((sum, item) => sum + item.épargne, 0);

    return {
      bestMonth,
      averageIncome,
      biggestExpenseAmount: biggestExpense ? getAmount(biggestExpense) : 0,
      biggestCategory,
      totalSavings,
    };
  }, [monthlyComparison, currentMonthExpenses, categories]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center text-gray-500">
          Chargement des statistiques...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Impossible de charger les statistiques
          </h2>
          <p className="text-gray-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500">Analysez vos finances en détail</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Meilleur mois</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.bestMonth.month}</p>
          <p className="text-sm text-green-600">
            {formatCurrency(metrics.bestMonth.épargne)} d'épargne
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Moy. mensuelle</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.averageIncome)}
          </p>
          <p className="text-sm text-gray-500">Revenus moyens</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Plus grosse dépense</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.biggestExpenseAmount)}
          </p>
          <p className="text-sm text-gray-500">{metrics.biggestCategory}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Épargne totale</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.totalSavings)}
          </p>
          <p className="text-sm text-green-600">Calculée depuis vos transactions</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Comparaison mensuelle</h3>
          <p className="text-sm text-gray-500">
            Évolution des revenus, dépenses et épargne
          </p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#bce3fb" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="dépenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="épargne" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Répartition détaillée</h3>
            <p className="text-sm text-gray-500">Dépenses par catégorie ce mois-ci</p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune dépense ce mois-ci.</p>
            ) : (
              categoryBreakdown.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
  className="text-xs px-2 py-1 rounded-full font-medium"
  style={{
    backgroundColor: `${category.color}15`,
    color: category.color,
  }}
>
  {category.percentage}%
</span>

                      <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">
              Tendance hebdomadaire
            </h3>
            <p className="text-sm text-gray-500">Dépenses par semaine ce mois-ci</p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bce3fb" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="montant"
                stroke="#3eb3f2"
                strokeWidth={3}
                dot={{ fill: '#0879bf', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}