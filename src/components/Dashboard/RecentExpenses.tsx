import React from 'react';
import { Clock, MoreVertical } from 'lucide-react';
import { Expense } from '../../types';
import { formatCurrency, formatDate, getCategoryIcon } from '../../utils/helpers';

interface RecentExpensesProps {
  expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Expenses</h3>
        <Clock size={20} className="text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {recentExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white">
                <span className="text-lg">{getCategoryIcon(expense.category)}</span>
              </div>
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                <p className="text-xs text-gray-500 capitalize">{expense.category}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/20 rounded">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {recentExpenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No expenses yet</p>
          <p className="text-sm">Add your first expense to get started</p>
        </div>
      )}
    </div>
  );
}