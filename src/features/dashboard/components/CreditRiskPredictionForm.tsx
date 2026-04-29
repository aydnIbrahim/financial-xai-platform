'use client';

import { useState } from 'react';
import { Loader, Activity, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';
import { RiskBadge } from '@/components/ui/Badge';

type PredictionResult = {
  prediction: number;
  risk_probability: number;
  risk_label: string;
  top_explanations: Array<{
    feature: string;
    value: number;
    importance: number;
  }>;
};

import { useRiskStore } from '@/store/useRiskStore';

export function CreditRiskPredictionForm() {
  const { customerData, setCustomerData, result, loading, error, fetchPrediction } = useRiskStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData({ [name]: Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchPrediction();
    } catch (err) {
      // Error is handled in store
    }
  };

  const isRisky = result?.prediction === 1;

  const formData = customerData;

  return (
    <div className="card p-6 border-t-4" style={{ borderColor: 'var(--primary)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Canlı Kredi Risk Tahmini (API Entegrasyonu)
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Müşteri verilerini girerek anlık model tahmini ve XAI açıklamaları alın.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Genel Bilgiler */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>Genel Bilgiler</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Kredi Limiti (LIMIT_BAL)</label>
                <input type="number" name="LIMIT_BAL" value={formData.LIMIT_BAL} onChange={handleChange} className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Yaş (AGE)</label>
                <input type="number" name="AGE" value={formData.AGE} onChange={handleChange} className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} required />
              </div>
            </div>
          </div>

          {/* Ödeme Durumu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>Gecikme Durumu (Aylar)</h4>
            <div className="grid grid-cols-3 gap-3">
              {['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6'].map(field => (
                <div key={field}>
                  <label className="block text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{field}</label>
                  <input type="number" name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full bg-transparent border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} required />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Fatura Tutarları */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>Fatura Tutarları</h4>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={`BILL_AMT${i}`} className="flex items-center gap-2">
                    <label className="w-16 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>AMT{i}</label>
                    <input type="number" name={`BILL_AMT${i}`} value={(formData as any)[`BILL_AMT${i}`]} onChange={handleChange} className="flex-1 bg-transparent border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} required />
                  </div>
                ))}
              </div>
            </div>

            {/* Ödeme Tutarları */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>Ödenen Tutarlar</h4>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={`PAY_AMT${i}`} className="flex items-center gap-2">
                    <label className="w-16 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>PAY{i}</label>
                    <input type="number" name={`PAY_AMT${i}`} value={(formData as any)[`PAY_AMT${i}`]} onChange={handleChange} className="flex-1 bg-transparent border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} required />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 disabled:opacity-70 hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              boxShadow: loading ? 'none' : 'var(--shadow-primary)'
            }}
          >
            {loading ? (
              <><Loader size={16} className="animate-spin-slow" /> Tahmin Ediliyor...</>
            ) : (
              <><Activity size={16} /> Riski Analiz Et</>
            )}
          </button>
        </form>

        {/* Results Section */}
        <div className="flex flex-col h-full">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>Analiz Sonucu</h4>
          
          {error && (
            <div className="p-4 rounded-xl flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border rounded-xl border-dashed" style={{ borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-500/5 text-indigo-500/40 mb-3">
                <BrainCircuit size={24} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tahmin sonucu bekleniyor</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Sol taraftaki formu doldurarak analiz başlatın.</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-xl border flex flex-col items-center text-center" style={{ 
                background: isRisky ? 'var(--danger-light)' : 'var(--success-light)',
                borderColor: isRisky ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'
              }}>
                <div className="mb-2">
                  {isRisky ? <AlertTriangle size={32} className="text-red-500" /> : <CheckCircle size={32} className="text-emerald-500" />}
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: isRisky ? 'var(--danger)' : 'var(--success)' }}>
                  {result.risk_label}
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Risk Olasılığı: <span className="font-bold">{(result.risk_probability * 100).toFixed(1)}%</span>
                </p>
                <RiskBadge score={result.risk_probability * 100} />
              </div>

              <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <h5 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>En Etkili Değişkenler (XAI)</h5>
                <div className="space-y-3">
                  {result.top_explanations.map((exp, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {exp.feature} <span className="opacity-50">(Değer: {exp.value})</span>
                        </span>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {(exp.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${Math.min(exp.importance * 100 * 2, 100)}%`,
                            background: isRisky ? 'var(--danger)' : 'var(--primary)'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
