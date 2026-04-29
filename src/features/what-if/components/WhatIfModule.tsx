'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Loader } from 'lucide-react';
import { useRiskStore, CustomerData, PredictionResult } from '@/store/useRiskStore';

function formatTL(v: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(v);
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, min, max, step, format, onChange }: SliderFieldProps) {
  const display = format ? format(value) : String(value);
  const pct     = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
        <span
          className="text-sm font-bold px-2.5 py-0.5 rounded-lg"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {format ? format(min) : min}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {format ? format(max) : max}
        </span>
      </div>
    </div>
  );
}

export function WhatIfModule() {
  const { customerData, fetchPrediction } = useRiskStore();

  const [limitBal, setLimitBal] = useState(customerData.LIMIT_BAL);
  const [pay0, setPay0]         = useState(customerData.PAY_0);
  const [payAmt1, setPayAmt1]   = useState(customerData.PAY_AMT1);

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<PredictionResult | null>(null);

  useEffect(() => {
    setLimitBal(customerData.LIMIT_BAL);
    setPay0(customerData.PAY_0);
    setPayAmt1(customerData.PAY_AMT1);
  }, [customerData]);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const simulatedData: CustomerData = {
        ...customerData,
        LIMIT_BAL: limitBal,
        PAY_0: pay0,
        PAY_AMT1: payAmt1
      };
      const data = await fetchPrediction(simulatedData);
      setResult(data);
    } catch (error) {
      console.error('Simülasyon hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const isApproved = result?.prediction === 0;

  return (
    <div className="card p-6" style={{ borderLeft: '3px solid var(--primary)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
        >
          <FlaskConical size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Eğer Senaryoları (What-If Simülasyonu)
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Seçili değişkenleri değiştirerek API üzerinden anlık simülasyon yapın.
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SliderField
          label="Kredi Limiti (LIMIT_BAL)"
          value={limitBal}
          min={10000}
          max={1000000}
          step={10000}
          format={formatTL}
          onChange={setLimitBal}
        />
        <SliderField
          label="Son Ödeme Gecikmesi (PAY_0)"
          value={pay0}
          min={-2}
          max={8}
          step={1}
          format={(v) => `${v} Ay`}
          onChange={setPay0}
        />
        <SliderField
          label="İlk Ödeme Tutarı (PAY_AMT1)"
          value={payAmt1}
          min={0}
          max={50000}
          step={1000}
          format={formatTL}
          onChange={setPayAmt1}
        />
      </div>

      {/* Simulate button */}
      <button
        id="simulate-button"
        onClick={handleSimulate}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold
                   transition-all duration-200 disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, var(--primary), #818cf8)',
          boxShadow: loading ? 'none' : 'var(--shadow-primary)',
        }}
      >
        {loading ? (
          <>
            <Loader size={15} className="animate-spin-slow" />
            Hesaplanıyor...
          </>
        ) : (
          <>
            <FlaskConical size={15} />
            Senaryoyu Simüle Et
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div
          className="mt-5 p-4 rounded-xl border animate-fade-in"
          style={{
            background:   isApproved ? 'var(--success-light)' : 'var(--danger-light)',
            borderColor:  isApproved ? '#6ee7b7'              : '#fca5a5',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Simülasyon Sonucu
            </p>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
              style={{
                background: isApproved ? '#d1fae5' : '#fee2e2',
                color:      isApproved ? '#065f46' : '#991b1b',
              }}
            >
              {result.risk_label}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Yeni Risk Skoru (Olasılık):
            </span>
            <span
              className="text-2xl font-bold"
              style={{ color: isApproved ? 'var(--success)' : 'var(--danger)' }}
            >
              {Math.round(result.risk_probability * 100)}
            </span>
          </div>
          <p className="text-xs leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
            Simülasyon işlemi canlı model üzerinden başarıyla tamamlandı. En etkili değişken {result.top_explanations[0]?.feature} oldu.
          </p>
        </div>
      )}
    </div>
  );
}
