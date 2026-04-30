import { User, Category, Transaction, Budget, Activity, Alert, Stats } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Marie Dubois',
  email: 'marie.dubois@example.com',
  avatar: 'MD',
  role: 'admin'
};

export const users: User[] = [
  currentUser,
  { id: '2', name: 'Thomas Martin', email: 'thomas.martin@example.com', avatar: 'TM', role: 'user' },
  { id: '3', name: 'Sophie Bernard', email: 'sophie.bernard@example.com', avatar: 'SB', role: 'user' },
  { id: '4', name: 'Lucas Petit', email: 'lucas.petit@example.com', avatar: 'LP', role: 'user' }
];

export const categories: Category[] = [
  { id: '1', name: 'Salaire', color: '#10b981', icon: 'Wallet', type: 'income' },
  { id: '2', name: 'Freelance', color: '#06b6d4', icon: 'Briefcase', type: 'income' },
  { id: '3', name: 'Investissements', color: '#8b5cf6', icon: 'TrendingUp', type: 'income' },
  { id: '4', name: 'Alimentation', color: '#f59e0b', icon: 'ShoppingCart', type: 'expense' },
  { id: '5', name: 'Transport', color: '#3b82f6', icon: 'Car', type: 'expense' },
  { id: '6', name: 'Logement', color: '#ef4444', icon: 'Home', type: 'expense' },
  { id: '7', name: 'Loisirs', color: '#ec4899', icon: 'Gamepad2', type: 'expense' },
  { id: '8', name: 'Santé', color: '#14b8a6', icon: 'Heart', type: 'expense' },
  { id: '9', name: 'Abonnements', color: '#6366f1', icon: 'CreditCard', type: 'expense' }
];

export const transactions: Transaction[] = [
  { id: '1', date: '2026-04-28', description: 'Salaire Avril', amount: 3500, type: 'income', category: categories[0], userId: '1' },
  { id: '2', date: '2026-04-27', description: 'Courses Carrefour', amount: -85.50, type: 'expense', category: categories[3], userId: '1', budgetId: '1' },
  { id: '3', date: '2026-04-26', description: 'Essence Total', amount: -65, type: 'expense', category: categories[4], userId: '1', budgetId: '2' },
  { id: '4', date: '2026-04-25', description: 'Netflix', amount: -15.99, type: 'expense', category: categories[8], userId: '1', budgetId: '5' },
  { id: '5', date: '2026-04-24', description: 'Restaurant', amount: -45, type: 'expense', category: categories[6], userId: '2', budgetId: '4' },
  { id: '6', date: '2026-04-23', description: 'Loyer Avril', amount: -950, type: 'expense', category: categories[5], userId: '1', budgetId: '3' },
  { id: '7', date: '2026-04-22', description: 'Mission Freelance', amount: 800, type: 'income', category: categories[1], userId: '1' },
  { id: '8', date: '2026-04-20', description: 'Pharmacie', amount: -28.50, type: 'expense', category: categories[7], userId: '1', budgetId: '6' },
  { id: '9', date: '2026-04-18', description: 'Uber', amount: -22, type: 'expense', category: categories[4], userId: '3', budgetId: '2' },
  { id: '10', date: '2026-04-15', description: 'Spotify', amount: -9.99, type: 'expense', category: categories[8], userId: '2', budgetId: '5' }
];

export const budgets: Budget[] = [
  {
    id: '1',
    name: 'Alimentation',
    amount: 400,
    spent: 285.50,
    period: 'monthly',
    category: categories[3],
    isShared: true,
    members: [users[0], users[1]],
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '2',
    name: 'Transport',
    amount: 200,
    spent: 187,
    period: 'monthly',
    category: categories[4],
    isShared: true,
    members: [users[0], users[2]],
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '3',
    name: 'Logement',
    amount: 1000,
    spent: 950,
    period: 'monthly',
    category: categories[5],
    isShared: false,
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '4',
    name: 'Loisirs',
    amount: 150,
    spent: 95,
    period: 'monthly',
    category: categories[6],
    isShared: true,
    members: [users[0], users[1], users[3]],
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '5',
    name: 'Abonnements',
    amount: 50,
    spent: 25.98,
    period: 'monthly',
    category: categories[8],
    isShared: true,
    members: users,
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '6',
    name: 'Santé',
    amount: 100,
    spent: 28.50,
    period: 'monthly',
    category: categories[7],
    isShared: false,
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  }
];

export const activities: Activity[] = [
  { id: '1', userId: '2', user: users[1], action: 'Ajout transaction', timestamp: '2026-04-27 14:30', details: 'Restaurant - 45€' },
  { id: '2', userId: '3', user: users[2], action: 'Modification budget', timestamp: '2026-04-26 10:15', details: 'Transport: 200€ → 250€' },
  { id: '3', userId: '1', user: users[0], action: 'Création budget', timestamp: '2026-04-25 16:45', details: 'Nouveau budget Santé' },
  { id: '4', userId: '4', user: users[3], action: 'Ajout membre', timestamp: '2026-04-24 09:20', details: 'Ajouté au budget Loisirs' },
  { id: '5', userId: '2', user: users[1], action: 'Suppression transaction', timestamp: '2026-04-23 11:00', details: 'Transaction annulée' }
];

export const alerts: Alert[] = [
  { id: '1', type: 'warning', message: 'Budget Transport bientôt atteint (93%)', budgetId: '2', timestamp: '2026-04-28', isRead: false },
  { id: '2', type: 'danger', message: 'Budget Alimentation dépassé de 15€', budgetId: '1', timestamp: '2026-04-27', isRead: false },
  { id: '3', type: 'info', message: 'Nouveau membre ajouté au budget Loisirs', budgetId: '4', timestamp: '2026-04-26', isRead: true }
];

export const stats: Stats = {
  totalIncome: 4300,
  totalExpenses: 1647.98,
  budgetRemaining: 1252.02,
  budgetUsed: 1572.98,
  savingsRate: 61.7
};
