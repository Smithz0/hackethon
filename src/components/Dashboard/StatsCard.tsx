import React from 'react';
import { DivideIcon } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: typeof DivideIcon;
  color: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color 
}: StatsCardProps) {
  const [currency] = useLocalStorage('currency', 'USD');
  const currencySymbols: Record<string, string> = {
    USD: '₹',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    // Add more as needed
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="floating-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
          <Icon size={24} className={`${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getChangeColor()}`}>
          {change}
        </span>
        <span className="text-xs text-gray-500">vs last month</span>
      </div>
    </div>
  );
}