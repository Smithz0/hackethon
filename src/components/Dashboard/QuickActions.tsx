import React from 'react';
import { Plus, Users, Upload, Calculator } from 'lucide-react';

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddGroup?: () => void;
}

export function QuickActions({ onAddExpense, onAddGroup }: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      color: 'bg-primary-500',
      onClick: onAddExpense,
    },
    ...(onAddGroup ? [{
      icon: Users,
      label: 'Create Group',
      color: 'bg-secondary-500',
      onClick: onAddGroup,
    }] : []),
    {
      icon: Upload,
      label: 'Scan Receipt',
      color: 'bg-accent-500',
      onClick: () => alert('Receipt scanning coming soon!'),
    },
    {
      icon: Calculator,
      label: 'Split Bill',
      color: 'bg-green-500',
      onClick: () => alert('Bill splitter coming soon!'),
    },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                ${action.color} text-white p-4 rounded-lg hover:scale-105 
                transition-all duration-200 shadow-lg hover:shadow-xl
                flex flex-col items-center space-y-2
              `}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}