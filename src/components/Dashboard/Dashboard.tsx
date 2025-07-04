import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target 
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { RecentExpenses } from './RecentExpenses';
import { SpendingChart } from './SpendingChart';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';

interface DashboardProps {
  onAddExpense: () => void;
  onAddGroup?: () => void;
}

export function Dashboard({ onAddExpense, onAddGroup }: DashboardProps) {
  const { state } = useApp();
  const { expenses, groups } = state;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseMonth = expense.date.getMonth();
    const currentMonth = new Date().getMonth();
    return expenseMonth === currentMonth;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseMonth = expense.date.getMonth();
    const lastMonth = new Date().getMonth() - 1;
    return expenseMonth === lastMonth;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = lastMonthExpenses > 0 
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1)
    : '0.0';

  const totalGroups = groups.length;
  const activeGroups = groups.filter(group => group.expenses.length > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-heading">Welcome back, {state.user?.name}!</h2>
          <p className="mt-1 text-default">
            Here's your financial overview for today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          change={`${monthlyChange}%`}
          changeType={parseFloat(monthlyChange) > 0 ? 'negative' : 'positive'}
          icon={DollarSign}
          color="bg-primary-500"
        />
        <StatsCard
          title="This Month"
          value={formatCurrency(thisMonthExpenses)}
          change={`${formatCurrency(thisMonthExpenses - lastMonthExpenses)}`}
          changeType={thisMonthExpenses > lastMonthExpenses ? 'negative' : 'positive'}
          icon={TrendingUp}
          color="bg-secondary-500"
        />
        <StatsCard
          title="Active Groups"
          value={activeGroups.toString()}
          change={`${totalGroups} total`}
          changeType="neutral"
          icon={Users}
          color="bg-accent-500"
        />
        <StatsCard
          title="Savings Goal"
          value="₹1,250"
          change="83% complete"
          changeType="positive"
          icon={Target}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentExpenses expenses={expenses} />
        </div>
        <div>
          <QuickActions onAddExpense={onAddExpense} onAddGroup={onAddGroup} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart expenses={expenses} />
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">Budget Overview</h3>
          <div className="space-y-4">
            {state.budgets.map((budget) => (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize font-medium">{budget.category}</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-gradient h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Timeline & Calendar View */}
      <div className="glass-card p-6 animate-slide-up mt-6">
        <h3 className="text-lg font-semibold mb-4">Expense Calendar (Coming Soon)</h3>
        <p className="text-gray-500">A visual calendar will appear here, plotting your expenses per day for better daily budget tracking.</p>
      </div>
    </div>
  );
}