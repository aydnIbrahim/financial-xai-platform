'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Loader, RotateCcw, ArrowUp, ArrowDown, Minus } from 'lucide-react';
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
  originalValue: number;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, originalValue, min, max, step, format, onChange }: SliderFieldProps) {
  const display = format ? format(value) : String(value);
  const pct     = ((value - min) / (max - min)) * 100;
  const changed = value !== originalValue;

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
          className="text-sm font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5"
          style={{
            background: changed ? 'rgba(245, 158, 11, 0.15)' : 'var(--primary-light)',
            color: changed ? '#d97706' : 'var(--primary)',
            border: changed ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
          }}
        >
          {display}
          {changed && (
            <span className="text-[10px] opacity-75">
              (Orijinal: {format ? format(originalValue) : originalValue})
            </span>
          )}
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
          background: `linear-gradient(to right, ${changed ? '#f59e0b' : 'var(--primary)'} ${pct}%, var(--border) ${pct}%)`,
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

function DeltaIndicator({ original, current, suffix = '' }: { original: number; current: number; suffix?: string }) {
  const diff = current - original;
  if (Math.abs(diff) < 0.001) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}>
        <Minus size={10} /> Değişim yok
      </span>
    );
  }
  const isUp = diff > 0;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
      style={{
        background: isUp ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        color: isUp ? '#ef4444' : '#10b981',
      }}
    >
      {isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {isUp ? '+' : ''}{Math.round(diff)}{suffix}
    </span>
  );
}

export function WhatIfModule() {
  const {
    customerData,
    result,
    fetchPrediction,
    applyScenario,
    clearScenario,
    isScenarioActive,
    scenarioResult,
  } = useRiskStore();

  const [limitBal, setLimitBal] = useState(customerData.LIMIT_BAL);
  const [pay0, setPay0]         = useState(customerData.PAY_0);
  const [payAmt1, setPayAmt1]   = useState(customerData.PAY_AMT1);

  const [loading, setLoading] = useState(false);

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
      // Senaryo sonucunu store'a yaz → tüm arayüz güncellenir
      applyScenario(simulatedData, data);
    } catch (error) {
      console.error('Simülasyon hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearScenario();
    // Slider'ları orijinal değerlere geri döndür
    setLimitBal(customerData.LIMIT_BAL);
    setPay0(customerData.PAY_0);
    setPayAmt1(customerData.PAY_AMT1);
  };

  const activeResult = isScenarioActive ? scenarioResult : null;
  const isApproved = activeResult?.prediction === 0;

  // Delta hesaplama (orijinal vs senaryo)
  const originalRiskScore = result ? Math.round(result.risk_probability * 100) : 0;
  const scenarioRiskScore = activeResult ? Math.round(activeResult.risk_probability * 100) : 0;

  return (
    <div className="card p-6" style={{ borderLeft: `3px solid ${isScenarioActive ? '#f59e0b' : 'var(--primary)'}` }}>

      {/* Scenario Active Banner */}
      {isScenarioActive && (
        <div
          className="mb-5 px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(249, 115, 22, 0.08))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⚗️</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#d97706' }}>
                Senaryo Modu Aktif
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Tüm arayüz simüle edilmiş değerleri göstermektedir.
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-80"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#d97706',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <RotateCcw size={12} />
            Orijinale Dön
          </button>
        </div>
      )}

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
          originalValue={customerData.LIMIT_BAL}
          min={10000}
          max={1000000}
          step={10000}
          format={formatTL}
          onChange={setLimitBal}
        />
        <SliderField
          label="Son Ödeme Gecikmesi (PAY_0)"
          value={pay0}
          originalValue={customerData.PAY_0}
          min={-2}
          max={8}
          step={1}
          format={(v) => `${v} Ay`}
          onChange={setPay0}
        />
        <SliderField
          label="İlk Ödeme Tutarı (PAY_AMT1)"
          value={payAmt1}
          originalValue={customerData.PAY_AMT1}
          min={0}
          max={50000}
          step={1000}
          format={formatTL}
          onChange={setPayAmt1}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
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

        {isScenarioActive && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                       transition-all duration-200 hover:opacity-80"
            style={{
              background: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <RotateCcw size={14} />
            Senaryoyu Temizle
          </button>
        )}
      </div>

      {/* Comparison Result */}
      {activeResult && result && (
        <div
          className="mt-5 p-5 rounded-xl border animate-fade-in"
          style={{
            background: isApproved ? 'var(--success-light)' : 'var(--danger-light)',
            borderColor: isApproved ? '#6ee7b7' : '#fca5a5',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Simülasyon Sonucu
            </p>
            <div className="flex items-center gap-2">
              <DeltaIndicator
                original={originalRiskScore}
                current={scenarioRiskScore}
                suffix=" puan"
              />
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full uppercase"
                style={{
                  background: isApproved ? '#d1fae5' : '#fee2e2',
                  color: isApproved ? '#065f46' : '#991b1b',
                }}
              >
                {activeResult.risk_label}
              </span>
            </div>
          </div>

          {/* Score comparison */}
          <div className="flex items-center gap-6 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Orijinal Risk
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>
                {originalRiskScore}
              </span>
            </div>
            <div className="text-lg" style={{ color: 'var(--text-muted)' }}>→</div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                Senaryo Risk
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: isApproved ? 'var(--success)' : 'var(--danger)' }}
              >
                {scenarioRiskScore}
              </span>
            </div>
          </div>

          {/* Top factor comparison */}
          {activeResult.top_explanations.length > 0 && (
            <div className="pt-3 border-t" style={{ borderColor: isApproved ? '#a7f3d0' : '#fecaca' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Senaryo Özellik Etkileri
              </p>
              <div className="space-y-1.5">
                {activeResult.top_explanations.slice(0, 5).map((exp, idx) => {
                  const origExp = result.top_explanations.find(e => e.feature === exp.feature);
                  const origImportance = origExp?.importance ?? 0;
                  const diff = exp.importance - origImportance;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {exp.feature}
                      </span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }}>
                          {(origImportance * 100).toFixed(1)}%
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>→</span>
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {(exp.importance * 100).toFixed(1)}%
                        </span>
                        {Math.abs(diff) > 0.001 && (
                          <span style={{ color: diff > 0 ? '#ef4444' : '#10b981', fontSize: '10px', fontWeight: 600 }}>
                            ({diff > 0 ? '+' : ''}{(diff * 100).toFixed(1)}%)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-xs leading-relaxed italic mt-3" style={{ color: 'var(--text-secondary)' }}>
            Simülasyon canlı model üzerinden tamamlandı. En etkili değişken: {activeResult.top_explanations[0]?.feature ?? '—'}
          </p>
        </div>
      )}
    </div>
  );
}
