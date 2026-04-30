export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  userId: string;
  budgetId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  category: Category;
  isShared: boolean;
  members?: User[];
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  userId: string;
  user: User;
  action: string;
  timestamp: string;
  details: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  budgetId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Stats {
  totalIncome: number;
  totalExpenses: number;
  budgetRemaining: number;
  budgetUsed: number;
  savingsRate: number;
}
