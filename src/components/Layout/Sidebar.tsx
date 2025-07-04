import React from 'react';
import { 
  Home, 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings,
  Target,
  Brain,
  Receipt,
  TrendingUp,
  X,
  Divide as SplitIcon
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'splitbill', label: 'Split Bill', icon: SplitIcon },
  { id: 'groups', label: 'Groups', icon: Users },
  { id: 'budgets', label: 'Budgets', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'receipts', label: 'Receipts', icon: Receipt },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const [currency] = useLocalStorage('currency', 'USD');
  const currencySymbols: Record<string, string> = {
    USD: '₹',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    // Add more as needed
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen w-64 glass-card m-4 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <span className="font-bold text-lg text-heading">SplitWise</span>
            </div>
            <button
              onClick={onClose}
              className="glass-button p-2 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-gradient text-white shadow-lg' 
                      : 'hover:bg-white/10 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-white/20">
            <div className="glass-card p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-primary-500" size={24} />
              <p className="text-sm font-medium">Monthly Savings</p>
              <p className="text-2xl font-bold gradient-text">{currencySymbols[currency] || currency}124</p>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}