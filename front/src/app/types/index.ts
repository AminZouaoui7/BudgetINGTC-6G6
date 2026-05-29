export type UserRole = 'admin' | 'user';
export type TransactionType = 'income' | 'expense';
export type CategoryType = 'income' | 'expense';
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';
export type AlertType = 'warning' | 'danger' | 'info';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon: string;
  type: CategoryType;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId?: number | null;
  category?: Category | null;
  userId: number;
  budgetId?: number | null;
  author?: Pick<User, 'id' | 'fullName' | 'email'> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  spent: number;
  description?: string;
  periodType: BudgetPeriod;
  isShared: boolean;
  ownerId: number;
  owner?: User;
  members?: User[];
  startDate: string;
  endDate: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  userId: number;
  user: Pick<User, 'id' | 'fullName' | 'email'>;
  action: string;
  timestamp: string;
  details: string;
}

export interface Comment {
  id: number;
  content: string;
  transactionId: number;
  author?: Pick<User, 'id' | 'fullName' | 'email'> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Alert {
  id: number;
  type: AlertType;
  rawType?: string;
  message: string;
  budgetId?: number;
  timestamp: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetRemaining: number;
  budgetUsed: number;
  savingsRate: number;
}
