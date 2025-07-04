import React, { useState, useRef } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { ExpenseCategory, Expense } from '../../types';
import { generateId } from '../../utils/helpers';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ExpenseFormProps {
  onClose: () => void;
  onSave: (expense: Expense) => void;
  expense?: Expense;
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'bills', label: 'Bills & Utilities' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health & Medical' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

// Supported languages for speech recognition
const supportedLanguages = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  // Add more as needed
];

export function ExpenseForm({ onClose, onSave, expense }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || 'other' as ExpenseCategory,
    date: expense?.date ? expense.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: expense?.description || '',
    tags: expense?.tags.join(', ') || '',
  });

  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);
  const [listeningField, setListeningField] = useState<string | null>(null);
  const [currency] = useLocalStorage('currency', 'USD');
  const currencySymbols: Record<string, string> = {
    USD: '₹',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    // Add more as needed
  };

  // Start speech recognition for a specific field
  const startListening = (field: string) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prev) => ({ ...prev, [field]: transcript }));
      setListeningField(null);
    };
    recognition.onerror = () => setListeningField(null);
    recognition.onend = () => setListeningField(null);
    recognitionRef.current = recognition;
    setListeningField(field);
    recognition.start();
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListeningField(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: Expense = {
      id: expense?.id || generateId(),
      title: formData.title,
      amount: parseFloat(formData.amount.toString()),
      category: formData.category,
      date: new Date(formData.date),
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      userId: '1', // Mock user ID
    };

    onSave(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="glass-button p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Language Selector */}
        <div className="p-6 pt-2 pb-0">
          <label className="block text-sm font-medium mb-2">Voice Input Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none mb-2"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {/* Title Field with Voice Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                placeholder="Enter expense title"
                required
              />
            </div>
            <button type="button" onClick={() => listeningField === 'title' ? stopListening() : startListening('title')} className={`glass-button p-2 ${listeningField === 'title' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for title">
              <Upload size={18} />
            </button>
          </div>

          {/* Amount Field with Voice Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbols[currency] || currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-3 pl-8 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <button type="button" onClick={() => listeningField === 'amount' ? stopListening() : startListening('amount')} className={`glass-button p-2 ${listeningField === 'amount' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for amount">
                <Upload size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                  className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => listeningField === 'category' ? stopListening() : startListening('category')} className={`glass-button p-2 ${listeningField === 'category' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for category">
                  <Upload size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Date Field with Voice Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                required
              />
            </div>
            <button type="button" onClick={() => listeningField === 'date' ? stopListening() : startListening('date')} className={`glass-button p-2 ${listeningField === 'date' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for date">
              <Upload size={18} />
            </button>
          </div>

          {/* Description Field with Voice Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                rows={3}
                placeholder="Optional description"
              />
            </div>
            <button type="button" onClick={() => listeningField === 'description' ? stopListening() : startListening('description')} className={`glass-button p-2 ${listeningField === 'description' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for description">
              <Upload size={18} />
            </button>
          </div>

          {/* Tags Field with Voice Input */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                placeholder="e.g., coffee, meeting, business"
              />
            </div>
            <button type="button" onClick={() => listeningField === 'tags' ? stopListening() : startListening('tags')} className={`glass-button p-2 ${listeningField === 'tags' ? 'bg-primary-500 text-white' : ''}`} title="Voice input for tags">
              <Upload size={18} />
            </button>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass-button py-3 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-gradient text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              <Save size={18} className="inline mr-2" />
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}