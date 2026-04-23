'use client';

import { useState } from 'react';

type SimulationResult = {
  decision: 'APPROVED' | 'REJECTED';
  riskScore: number;
  riskLabel: string;
  message: string;
};

export function WhatIfModule() {
  const [income, setIncome] = useState(15000);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [term, setTerm] = useState(36);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, loanAmount, term })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Simulasyon hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
      <h3 className="text-lg font-semibold text-indigo-900 mb-4">Eğer Senaryoları (What-If)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-indigo-800 mb-1">Aylık Gelir (TL): {income}</label>
          <input 
            type="range" min="5000" max="50000" step="1000" 
            value={income} onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-800 mb-1">İstenen Kredi (TL): {loanAmount}</label>
          <input 
            type="range" min="10000" max="500000" step="5000" 
            value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-800 mb-1">Vade (Ay): {term}</label>
          <input 
            type="range" min="12" max="120" step="12" 
            value={term} onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={loading}
        className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
      >
        {loading ? 'Hesaplanıyor...' : 'Senaryoyu Simüle Et'}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-lg border ${result.decision === 'APPROVED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h4 className="font-semibold mb-2">Simülasyon Sonucu</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Yeni Risk Skoru: <strong className="text-lg">{result.riskScore}</strong></span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${result.decision === 'APPROVED' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {result.riskLabel}
            </span>
          </div>
          <p className="text-sm text-gray-700 italic">{result.message}</p>
        </div>
      )}
    </div>
  );
}
