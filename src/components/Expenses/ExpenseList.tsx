import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { formatCurrency, formatDate, getCategoryIcon, groupExpensesByDate } from '../../utils/helpers';

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ 
  expenses, 
  onAddExpense, 
  onEditExpense, 
  onDeleteExpense 
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredExpenses = expenses
    .filter(expense => 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(expense => 
      filterCategory === 'all' || expense.category === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const groupedExpenses = groupExpensesByDate(filteredExpenses);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-heading">Expenses</h2>
          <p className="mt-1 text-default">
            Track and manage your expenses
          </p>
        </div>
        <button
          onClick={onAddExpense}
          className="bg-primary-gradient text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
              className="px-4 py-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="food">Food & Dining</option>
              <option value="transport">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="bills">Bills & Utilities</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health & Medical</option>
              <option value="travel">Travel</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-4 py-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {formatDate(new Date(date))}
              </h3>
              <div className="space-y-2">
                {dayExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-all duration-200 group border border-white/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white">
                        <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{expense.title}</h4>
                        <p className="text-sm text-gray-500">{expense.description}</p>
                        {expense.tags.length > 0 && (
                          <div className="flex space-x-1 mt-1">
                            {expense.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
                        <p className="text-sm text-gray-500 capitalize">{expense.category}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">No expenses found</h3>
            <p className="text-gray-400">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first expense to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}