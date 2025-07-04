import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { FinancialInsight } from '../../types';
import { getInsightPriorityColor } from '../../utils/helpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface InsightsPanelProps {
  insights: FinancialInsight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const [currency] = useLocalStorage('currency', 'USD');
  const currencySymbols: Record<string, string> = {
    USD: '₹',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    // Add more as needed
  };

  const getInsightIcon = (type: FinancialInsight['type']) => {
    switch (type) {
      case 'spending_pattern':
        return TrendingUp;
      case 'budget_alert':
        return AlertTriangle;
      case 'suggestion':
        return Lightbulb;
      case 'prediction':
        return Target;
      default:
        return Brain;
    }
  };

  const getInsightBackground = (priority: FinancialInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-heading">AI Insights</h2>
        <p className="mt-1 text-default">
          Get smart recommendations and insights on your spending
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Brain className="text-primary-500" size={24} />
          <h3 className="text-xl font-semibold">Smart Recommendations</h3>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getInsightBackground(insight.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon 
                      size={20} 
                      className={`text-${insight.priority === 'high' ? 'red' : insight.priority === 'medium' ? 'yellow' : 'green'}-600`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {insights.length === 0 && (
          <div className="text-center py-12">
            <Brain size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No insights yet</h3>
            <p className="text-gray-400">
              Add more expenses to get personalized financial insights
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Spending Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">This week vs last week</span>
              <span className="text-sm text-green-600">-12%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Food expenses</span>
              <span className="text-sm text-red-600">+23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Transport costs</span>
              <span className="text-sm text-green-600">-8%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Savings Opportunities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Switch to monthly coffee plan</span>
              <span className="text-sm text-green-600 ml-auto">{currencySymbols[currency] || currency}15/mo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Reduce dining out frequency</span>
              <span className="text-sm text-yellow-600 ml-auto">{currencySymbols[currency] || currency}40/mo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Carpool for work commute</span>
              <span className="text-sm text-blue-600 ml-auto">{currencySymbols[currency] || currency}25/mo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}