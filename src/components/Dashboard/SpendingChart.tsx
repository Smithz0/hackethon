import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { calculateCategoryTotals } from '../../utils/helpers';
import { Expense } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SpendingChartProps {
  expenses: Expense[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const [currency] = useLocalStorage('currency', 'USD');
  const currencySymbols: Record<string, string> = {
    USD: '₹',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    // Add more as needed
  };
  const data = calculateCategoryTotals(expenses);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary-500">{currencySymbols[currency] || currency}{payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Spending by Category</h3>
        <TrendingUp size={20} className="text-primary-500" />
      </div>
      
      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
            <p>No spending data yet</p>
            <p className="text-sm">Add expenses to see your spending breakdown</p>
          </div>
        </div>
      )}
    </div>
  );
}