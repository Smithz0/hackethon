import { Expense, Group, Budget, FinancialInsight, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Smith',
  email: 'smith@email.com',
  avatar: '',
  preferences: {
    theme: 'light',
    currency: 'INR',
    notifications: true,
    language: 'en',
  },
};

export const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Coffee at Starbucks',
    amount: 4.50,
    category: 'food',
    date: new Date('2024-01-15'),
    description: 'Morning coffee with Sarah',
    tags: ['coffee', 'meeting'],
    userId: '1',
  },
  {
    id: '2',
    title: 'Uber to Airport',
    amount: 25.00,
    category: 'transport',
    date: new Date('2024-01-14'),
    description: 'Business trip transport',
    tags: ['travel', 'business'],
    userId: '1',
  },
  {
    id: '3',
    title: 'Dinner at Italian Restaurant',
    amount: 85.00,
    category: 'food',
    date: new Date('2024-01-13'),
    description: 'Team dinner',
    tags: ['dinner', 'team'],
    userId: '1',
    groupId: 'group1',
    splitType: 'equal',
    participants: [
      { userId: '1', amount: 21.25, settled: true },
      { userId: '2', amount: 21.25, settled: false },
      { userId: '3', amount: 21.25, settled: false },
      { userId: '4', amount: 21.25, settled: true },
    ],
  },
  {
    id: '4',
    title: 'Netflix Subscription',
    amount: 15.99,
    category: 'entertainment',
    date: new Date('2024-01-12'),
    description: 'Monthly subscription',
    tags: ['subscription', 'entertainment'],
    userId: '1',
  },
  {
    id: '5',
    title: 'Groceries',
    amount: 67.43,
    category: 'food',
    date: new Date('2024-01-11'),
    description: 'Weekly grocery shopping',
    tags: ['groceries', 'essential'],
    userId: '1',
  },
  {
    id: '6',
    title: 'Gas Station',
    amount: 45.00,
    category: 'transport',
    date: new Date('2024-01-10'),
    description: 'Full tank',
    tags: ['gas', 'car'],
    userId: '1',
  },
];

export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Team Lunch Club',
    description: 'Weekly team lunches and dinners',
    members: [
      { id: '1', name: 'Smith', email: 'smith@email.com', balance: -15.50 },
      { id: '2', name: 'Sarah Wilson', email: 'sarah@email.com', balance: 21.25 },
      { id: '3', name: 'Mike Chen', email: 'mike@email.com', balance: 0.00 },
      { id: '4', name: 'Emma Davis', email: 'emma@email.com', balance: -5.75 },
    ],
    expenses: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    color: '#14b8a6',
  },
  {
    id: 'group2',
    name: 'Weekend Trip',
    description: 'Ski trip to Colorado',
    members: [
      { id: '1', name: 'Smith', email: 'smith@email.com', balance: 120.00 },
      { id: '5', name: 'Tom Brown', email: 'tom@email.com', balance: -60.00 },
      { id: '6', name: 'Lisa Garcia', email: 'lisa@email.com', balance: -60.00 },
    ],
    expenses: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    color: '#a855f7',
  },
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'food',
    amount: 400,
    spent: 157.93,
    period: 'monthly',
    alertThreshold: 80,
  },
  {
    id: '2',
    category: 'transport',
    amount: 200,
    spent: 70.00,
    period: 'monthly',
    alertThreshold: 75,
  },
  {
    id: '3',
    category: 'entertainment',
    amount: 100,
    spent: 15.99,
    period: 'monthly',
    alertThreshold: 85,
  },
];

export const mockInsights: FinancialInsight[] = [
  {
    id: '1',
    type: 'spending_pattern',
    title: 'Food spending increased',
    description: 'Your food expenses are 23% higher than last month. Consider meal planning to optimize costs.',
    priority: 'medium',
    actionable: true,
  },
  {
    id: '2',
    type: 'budget_alert',
    title: 'Transport budget on track',
    description: 'You\'re 35% through your monthly transport budget with 18 days remaining.',
    priority: 'low',
    actionable: false,
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Coffee savings opportunity',
    description: 'You could save $45/month by making coffee at home 3 days a week.',
    priority: 'medium',
    actionable: true,
  },
  {
    id: '4',
    type: 'prediction',
    title: 'Budget projection',
    description: 'Based on current spending, you\'ll likely exceed your food budget by $25 this month.',
    priority: 'high',
    actionable: true,
  },
];