import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ExpenseList } from './components/Expenses/ExpenseList';
import { ExpenseForm } from './components/Expenses/ExpenseForm';
import { InsightsPanel } from './components/Insights/InsightsPanel';
import { AppProvider, useApp } from './context/AppContext';
import { useTheme } from './hooks/useTheme';
import { mockUser, mockExpenses, mockGroups, mockBudgets, mockInsights } from './utils/mockData';
import { Expense } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  
  useEffect(() => {
    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_EXPENSES', payload: mockExpenses });
    dispatch({ type: 'SET_GROUPS', payload: mockGroups });
    dispatch({ type: 'SET_BUDGETS', payload: mockBudgets });
    dispatch({ type: 'SET_INSIGHTS', payload: mockInsights });
  }, [dispatch]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
    }
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const handleAddGroup = () => {
    // TODO: Implement group creation
    alert('Group creation coming soon!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddExpense={handleAddExpense} onAddGroup={handleAddGroup} />;
      case 'expenses':
        return (
          <ExpenseList
            expenses={state.expenses}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case 'splitbill':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Split Bill</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Easily split expenses among friends or group members.
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Split bill functionality coming soon!</p>
            </div>
          </div>
        );
      case 'insights':
        return <InsightsPanel insights={state.insights} />;
      case 'groups':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Groups</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your expense sharing groups
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Groups management coming soon!</p>
            </div>
          </div>
        );
      case 'budgets':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Budgets</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Set and track your spending limits
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Budget management coming soon!</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Analytics</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Detailed financial analytics and reports
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Advanced analytics coming soon!</p>
            </div>
          </div>
        );
      case 'receipts':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Receipts</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Scan and manage your receipts with OCR
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Receipt scanning coming soon!</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Customize your SplitWise experience
              </p>
            </div>
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500">Settings panel coming soon!</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onAddExpense={handleAddExpense} onAddGroup={handleAddGroup} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 min-h-screen">
          <Navbar
            onMenuToggle={() => setSidebarOpen(true)}
            onAddExpense={handleAddExpense}
            onAddGroup={handleAddGroup}
          />
          
          <main className="px-6 pb-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
          expense={editingExpense || undefined}
        />
      )}
    </div>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <AppProvider>
      <div className={theme}>
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;