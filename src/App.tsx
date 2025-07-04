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
import { Expense, Group } from './types';
import { SplitBill } from './components/Expenses/SplitBill';

function AppContent() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([{ name: '', email: '' }]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  
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
    setShowGroupForm(true);
  };

  const handleGroupFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || groupMembers.some(m => !m.name.trim() || !m.email.trim())) return;
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: '',
      members: groupMembers.map((m, i) => ({ id: (i+1).toString(), name: m.name, email: m.email, balance: 0 })),
      expenses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      color: '#2563EB',
    };
    dispatch({ type: 'ADD_GROUP', payload: newGroup });
    setShowGroupForm(false);
    setGroupName('');
    setGroupMembers([{ name: '', email: '' }]);
  };

  const handleAddMember = () => {
    setGroupMembers([...groupMembers, { name: '', email: '' }]);
  };

  const handleRemoveMember = (idx: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: 'name' | 'email', value: string) => {
    const updated = [...groupMembers];
    updated[idx][field] = value;
    setGroupMembers(updated);
  };

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCloseGroupDetails = () => {
    setSelectedGroup(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddExpense={handleAddExpense} />;
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
        return <SplitBill />;
      case 'insights':
        return <InsightsPanel insights={state.insights} />;
      case 'groups':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-heading">Groups</h2>
                <p className="mt-1 text-default">Manage your expense sharing groups</p>
              </div>
              <button onClick={handleAddGroup} className="bg-primary-gradient text-white px-4 py-2 rounded-lg font-medium">+ Create Group</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.groups.map((group: Group) => (
                <div key={group.id} className="glass-card p-6 cursor-pointer hover:shadow-lg" onClick={() => handleGroupClick(group)}>
                  <h3 className="text-lg font-semibold text-heading mb-2">{group.name}</h3>
                  <p className="text-sm text-default mb-2">Members: {group.members.length}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.members.map((m) => (
                      <span key={m.id} className="text-xs bg-gray-700 text-white px-2 py-1 rounded">{m.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Group Details Modal */}
            {selectedGroup && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="glass-card p-8 max-w-lg w-full relative">
                  <button onClick={handleCloseGroupDetails} className="absolute top-2 right-2 text-xl">✕</button>
                  <h3 className="text-2xl font-bold text-heading mb-4">{selectedGroup.name}</h3>
                  <h4 className="text-lg font-semibold mb-2">Members</h4>
                  <ul className="mb-4">
                    {selectedGroup.members.map((m) => (
                      <li key={m.id} className="text-default">{m.name} ({m.email})</li>
                    ))}
                  </ul>
                  <h4 className="text-lg font-semibold mb-2">Expenses</h4>
                  <ul>
                    {selectedGroup.expenses.length === 0 ? (
                      <li className="text-default">No expenses yet.</li>
                    ) : (
                      selectedGroup.expenses.map((e) => (
                        <li key={e.id} className="text-default">{e.title}: ₹{e.amount}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
            {/* Group Creation Modal */}
            {showGroupForm && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <form onSubmit={handleGroupFormSubmit} className="glass-card p-8 max-w-lg w-full space-y-4 relative">
                  <button type="button" onClick={() => setShowGroupForm(false)} className="absolute top-2 right-2 text-xl">✕</button>
                  <h3 className="text-2xl font-bold text-heading mb-4">Create Group</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Name</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                      placeholder="Enter group name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Members</label>
                    {groupMembers.map((m, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={e => handleMemberChange(i, 'name', e.target.value)}
                          className="flex-1 p-2 border rounded"
                          placeholder="Name"
                          required
                        />
                        <input
                          type="email"
                          value={m.email}
                          onChange={e => handleMemberChange(i, 'email', e.target.value)}
                          className="flex-1 p-2 border rounded"
                          placeholder="Email"
                          required
                        />
                        {groupMembers.length > 1 && (
                          <button type="button" onClick={() => handleRemoveMember(i)} className="text-red-500 px-2">✕</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddMember} className="text-accent font-medium mt-2">+ Add Member</button>
                  </div>
                  <button type="submit" className="bg-primary-gradient text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 w-full">Create Group</button>
                </form>
              </div>
            )}
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
        return <Dashboard onAddExpense={handleAddExpense} />;
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