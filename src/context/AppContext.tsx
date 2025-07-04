import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Expense, Group, Budget, User, FinancialInsight } from '../types';

interface AppState {
  user: User | null;
  expenses: Expense[];
  groups: Group[];
  budgets: Budget[];
  insights: FinancialInsight[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: Group }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'SET_INSIGHTS'; payload: FinancialInsight[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: {
    id: '1',
    name: 'Smith',
    email: 'smith@example.com',
    avatar: '',
    preferences: {
      theme: 'light',
      currency: 'INR',
      notifications: true,
      language: 'en',
    },
  },
  expenses: [],
  groups: [],
  budgets: [],
  insights: [],
  loading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.id ? action.payload : group
        ),
      };
    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload),
      };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}