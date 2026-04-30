import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyComparison = [
  { month: 'Nov', revenus: 3100, dépenses: 1750, épargne: 1350 },
  { month: 'Déc', revenus: 3200, dépenses: 2200, épargne: 1000 },
  { month: 'Jan', revenus: 3200, dépenses: 1800, épargne: 1400 },
  { month: 'Fév', revenus: 3400, dépenses: 2100, épargne: 1300 },
  { month: 'Mar', revenus: 3100, dépenses: 1900, épargne: 1200 },
  { month: 'Avr', revenus: 4300, dépenses: 1648, épargne: 2652 }
];

const categoryBreakdown = [
  { name: 'Logement', amount: 950, color: '#ef4444', percentage: 57.6 },
  { name: 'Alimentation', amount: 285, color: '#f59e0b', percentage: 17.3 },
  { name: 'Transport', amount: 187, color: '#3b82f6', percentage: 11.3 },
  { name: 'Loisirs', amount: 95, color: '#ec4899', percentage: 5.8 },
  { name: 'Santé', amount: 28, color: '#14b8a6', percentage: 1.7 },
  { name: 'Abonnements', amount: 26, color: '#6366f1', percentage: 1.6 },
  { name: 'Autres', amount: 77, color: '#8b5cf6', percentage: 4.7 }
];

const weeklyTrend = [
  { week: 'S1', montant: 280 },
  { week: 'S2', montant: 420 },
  { week: 'S3', montant: 350 },
  { week: 'S4', montant: 598 }
];

export function Statistics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500">Analysez vos finances en détail</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Meilleur mois</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Avril</p>
          <p className="text-sm text-green-600">+2652€ d'épargne</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Moy. mensuelle</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3383€</p>
          <p className="text-sm text-gray-500">Revenus moyens</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Plus grosse dépense</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">950€</p>
          <p className="text-sm text-gray-500">Logement</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Épargne totale</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">8902€</p>
          <p className="text-sm text-green-600">+15% vs année dernière</p>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Comparaison mensuelle</h3>
          <p className="text-sm text-gray-500">Évolution des revenus, dépenses et épargne</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyComparison}>
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
            <Bar dataKey="revenus" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="dépenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            <Bar dataKey="épargne" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Répartition détaillée</h3>
            <p className="text-sm text-gray-500">Dépenses par catégorie ce mois-ci</p>
          </div>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${category.color}15`,
                        color: category.color
                      }}
                    >
                      {category.percentage}%
                    </Badge>
                    <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                      {category.amount}€
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Trend */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">Tendance hebdomadaire</h3>
            <p className="text-sm text-gray-500">Dépenses par semaine en avril</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bce3fb" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #bce3fb',
                  borderRadius: '8px'
                }}
              />
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
