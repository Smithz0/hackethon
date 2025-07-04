import React, { useState } from 'react';

interface Participant {
  name: string;
  share: number;
}

type SplitType = 'equal' | 'custom' | 'percentage';

export function SplitBill() {
  const [total, setTotal] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', share: 0 },
    { name: '', share: 0 },
  ]);
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [result, setResult] = useState<Participant[] | null>(null);

  const handleParticipantChange = (index: number, field: 'name' | 'share', value: string) => {
    const updated = [...participants];
    if (field === 'name') updated[index].name = value;
    if (field === 'share') updated[index].share = parseFloat(value) || 0;
    setParticipants(updated);
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', share: 0 }]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSplit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(total);
    if (!amount || amount <= 0 || participants.length < 2) return;
    let split: Participant[] = [];
    if (splitType === 'equal') {
      const share = parseFloat((amount / participants.length).toFixed(2));
      split = participants.map(p => ({ ...p, share }));
    } else if (splitType === 'custom') {
      split = participants.map(p => ({ ...p }));
      const sum = split.reduce((acc, p) => acc + p.share, 0);
      if (sum !== amount) {
        alert('Custom shares must add up to total amount');
        return;
      }
    } else if (splitType === 'percentage') {
      split = participants.map(p => ({ ...p, share: parseFloat(((amount * (p.share / 100))).toFixed(2)) }));
      const sum = split.reduce((acc, p) => acc + p.share, 0);
      if (Math.abs(sum - amount) > 0.01) {
        alert('Percentages must add up to 100%');
        return;
      }
    }
    setResult(split);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto text-white">
      <div>
        <h2 className="text-3xl font-bold text-heading">Split Bill</h2>
        <p className="mt-1 text-default">Easily split expenses among friends or group members.</p>
      </div>
      <form className="glass-card p-6 space-y-4" onSubmit={handleSplit}>
        <div>
          <label className="block text-sm font-medium mb-2">Total Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={total}
            onChange={e => setTotal(e.target.value)}
            className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
            placeholder="Enter total amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Split Type</label>
          <select
            value={splitType}
            onChange={e => setSplitType(e.target.value as SplitType)}
            className="w-full p-3 glass-card border border-white/20 rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
          >
            <option value="equal">Equal</option>
            <option value="custom">Custom Amount</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Participants</label>
          {participants.map((p, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={p.name}
                onChange={e => handleParticipantChange(i, 'name', e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder={`Name #${i + 1}`}
                required
              />
              {splitType === 'custom' && (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.share}
                  onChange={e => handleParticipantChange(i, 'share', e.target.value)}
                  className="w-24 p-2 border rounded"
                  placeholder="Amount"
                  required
                />
              )}
              {splitType === 'percentage' && (
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={p.share}
                  onChange={e => handleParticipantChange(i, 'share', e.target.value)}
                  className="w-24 p-2 border rounded"
                  placeholder="%"
                  required
                />
              )}
              {participants.length > 2 && (
                <button type="button" onClick={() => handleRemoveParticipant(i)} className="text-red-500 px-2">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddParticipant} className="text-accent font-medium mt-2">+ Add Participant</button>
        </div>
        <button type="submit" className="bg-primary-gradient text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 w-full">Split Bill</button>
      </form>
      {result && (
        <div className="glass-card p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4 text-heading">Split Result</h3>
          <ul className="space-y-2">
            {result.map((p, i) => (
              <li key={i} className="flex justify-between text-default">
                <span>{p.name}</span>
                <span>₹{p.share.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 