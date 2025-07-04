export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  tags: string[];
  receipt?: string;
  userId: string;
  groupId?: string;
  splitType?: SplitType;
  participants?: Participant[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: Member[];
  expenses: Expense[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  balance: number;
}

export interface Participant {
  userId: string;
  amount: number;
  settled: boolean;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly';
  alertThreshold: number;
}

export interface FinancialInsight {
  id: string;
  type: 'spending_pattern' | 'budget_alert' | 'suggestion' | 'prediction';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  data?: any;
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'bills'
  | 'shopping'
  | 'health'
  | 'travel'
  | 'education'
  | 'other';

export type SplitType = 'equal' | 'custom' | 'percentage';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  currency: string;
  notifications: boolean;
  language: string;
}