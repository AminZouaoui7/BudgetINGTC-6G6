import { Wallet, TrendingDown, TrendingUp, PiggyBank, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stats, transactions, budgets, activities } from '../data/mockData';

const monthlyData = [
  { month: 'Jan', revenus: 3200, dépenses: 1800 },
  { month: 'Fév', revenus: 3400, dépenses: 2100 },
  { month: 'Mar', revenus: 3100, dépenses: 1900 },
  { month: 'Avr', revenus: 4300, dépenses: 1648 }
];

const categoryData = [
  { name: 'Logement', value: 950, color: '#ef4444' },
  { name: 'Alimentation', value: 285, color: '#f59e0b' },
  { name: 'Transport', value: 187, color: '#3b82f6' },
  { name: 'Loisirs', value: 95, color: '#ec4899' },
  { name: 'Autres', value: 131, color: '#8b5cf6' }
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Revenus totaux"
          value={`${stats.totalIncome.toLocaleString()}€`}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: 12.5, isPositive: true }}
          color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        />
        <StatsCard
          title="Dépenses totales"
          value={`${stats.totalExpenses.toLocaleString()}€`}
          icon={<TrendingDown className="w-6 h-6" />}
          trend={{ value: 3.2, isPositive: false }}
          color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        />
        <StatsCard
          title="Budget restant"
          value={`${stats.budgetRemaining.toLocaleString()}€`}
          icon={<Wallet className="w-6 h-6" />}
          color="linear-gradient(135deg, #3eb3f2 0%, #0879bf 100%)"
        />
        <StatsCard
          title="Taux d'épargne"
          value={`${stats.savingsRate}%`}
          icon={<PiggyBank className="w-6 h-6" />}
          trend={{ value: 8.1, isPositive: true }}
          color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bce3fb" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #bce3fb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              <Line type="monotone" dataKey="dépenses" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Transactions récentes</h3>
            <a href="#" className="text-sm text-[#0879bf] hover:text-[#065d93] font-medium">
              Voir tout
            </a>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f0f8ff] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${transaction.category.color}15` }}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5" style={{ color: transaction.category.color }} />
                    ) : (
                      <ArrowDownRight className="w-5 h-5" style={{ color: transaction.category.color }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}€
                  </p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Budgets Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Budgets actifs</h3>
            <Badge variant="info">{budgets.length} budgets</Badge>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 4).map((budget) => {
              const percentage = (budget.spent / budget.amount) * 100;
              const variant = percentage > 100 ? 'danger' : percentage > 80 ? 'warning' : 'success';

              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: budget.category.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{budget.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {budget.spent.toLocaleString()}€ / {budget.amount.toLocaleString()}€
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

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#0879bf]" />
          <h3 className="font-semibold text-gray-900">Activité collaborative</h3>
        </div>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f0f8ff] transition-colors">
              <Avatar name={activity.user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user.name}</span>
                  {' '}<span className="text-gray-600">{activity.action}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
