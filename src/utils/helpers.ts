import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { ExpenseCategory, ChartData } from '../types';

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE');
  if (isThisMonth(date)) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
}

export function getCategoryIcon(category: ExpenseCategory): string {
  const icons = {
    food: '🍽️',
    transport: '🚗',
    entertainment: '🎬',
    bills: '💡',
    shopping: '🛍️',
    health: '⚕️',
    travel: '✈️',
    education: '📚',
    other: '📦',
  };
  return icons[category] || icons.other;
}

export function getCategoryColor(category: ExpenseCategory): string {
  const colors = {
    food: '#14b8a6',
    transport: '#3b82f6',
    entertainment: '#a855f7',
    bills: '#f59e0b',
    shopping: '#ec4899',
    health: '#10b981',
    travel: '#06b6d4',
    education: '#8b5cf6',
    other: '#6b7280',
  };
  return colors[category] || colors.other;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function groupExpensesByDate(expenses: any[]): { [key: string]: any[] } {
  return expenses.reduce((groups, expense) => {
    const date = format(expense.date, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});
}

export function calculateCategoryTotals(expenses: any[]): ChartData[] {
  const totals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(totals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount as number,
    color: getCategoryColor(category as ExpenseCategory),
  }));
}

export function calculateBalances(group: any): { [userId: string]: number } {
  const balances: { [userId: string]: number } = {};
  
  // Initialize balances
  group.members.forEach((member: any) => {
    balances[member.id] = 0;
  });

  // Calculate balances from expenses
  group.expenses.forEach((expense: any) => {
    if (expense.participants) {
      expense.participants.forEach((participant: any) => {
        balances[participant.userId] -= participant.amount;
      });
      // Add the full amount to the person who paid
      balances[expense.userId] += expense.amount;
    }
  });

  return balances;
}

export function getInsightPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return colors[priority];
}

export function calculateBudgetProgress(budget: any): number {
  return Math.min((budget.spent / budget.amount) * 100, 100);
}

export function isOverBudget(budget: any): boolean {
  return budget.spent > budget.amount;
}

export function shouldShowBudgetAlert(budget: any): boolean {
  const progress = calculateBudgetProgress(budget);
  return progress >= budget.alertThreshold;
}