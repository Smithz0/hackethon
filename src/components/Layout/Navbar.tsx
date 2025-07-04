import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  Settings, 
  User,
  Search,
  PlusCircle
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onMenuToggle: () => void;
  onAddExpense: () => void;
  onAddGroup: () => void;
}

export function Navbar({ onMenuToggle, onAddExpense, onAddGroup }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { state } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="glass-card sticky top-0 z-50 mx-4 mt-4 mb-6">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="glass-button p-2 md:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">SW</span>
              </div>
              <h1 className="text-xl font-bold text-heading hidden sm:block">
                SplitWise
              </h1>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search expenses, groups..."
                className="w-full pl-10 pr-4 py-2 glass-card border-0 text-sm focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="glass-button p-2 relative"
                >
                  <PlusCircle size={20} />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50 animate-scale-in">
                    <button
                      onClick={() => {
                        onAddExpense();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
                    >
                      Add Expense
                    </button>
                    <button
                      onClick={() => {
                        onAddGroup();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
                    >
                      Create Group
                    </button>
                  </div>
                )}
              </div>
              
              <button className="glass-button p-2 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="glass-button p-2"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{state.user?.name}</p>
                <p className="text-xs text-gray-500">{state.user?.email}</p>
              </div>
              <img
                src={state.user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}