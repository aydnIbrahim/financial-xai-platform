'use client';

import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { WhatIfModule } from '@/features/what-if/components/WhatIfModule';
import { CreditRiskPredictionForm } from './CreditRiskPredictionForm';
import { FeedbackWidget } from '@/features/feedback/components/FeedbackWidget';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { RiskBadge } from '@/components/ui/Badge';
import { Activity, TrendingDown, TrendingUp, FlaskConical, RotateCcw } from 'lucide-react';
import { useRiskStore } from '@/store/useRiskStore';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs font-semibold shadow-lg space-y-1">
      {payload.map((entry, i) => {
        const val = entry.value;
        const label = entry.dataKey === 'scenarioContribution' ? 'Senaryo' : 'Orijinal';
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
            <span style={{ color: val > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {val > 0 ? '+' : ''}{val.toFixed(3)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RiskGauge({ score, label }: { score: number; label?: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const dashOff = circ * (1 - pct * 0.75);
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="100" viewBox="0 0 140 100">
        <circle cx="70" cy="90" r={r} fill="none"
          stroke="var(--border)" strokeWidth="10"
          strokeDasharray={`${circ * 0.75} ${circ}`}
          strokeDashoffset="0"
          transform="rotate(135 70 90)"
          strokeLinecap="round"
        />
        <circle cx="70" cy="90" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${circ * 0.75} ${circ}`}
          strokeDashoffset={dashOff}
          transform="rotate(135 70 90)"
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="70" y="82" textAnchor="middle" fontSize="22" fontWeight="700"
          fill="var(--text-primary)" fontFamily="inherit">{score}</text>
        <text x="70" y="96" textAnchor="middle" fontSize="9" fill="var(--text-muted)"
          fontFamily="inherit" fontWeight="600" letterSpacing="0.05em">
          {label || 'RİSK SKORU'}
        </text>
      </svg>
    </div>
  );
}

export function SpecialistDashboard() {
  const {
    result,
    loading,
    fetchPrediction,
    isScenarioActive,
    scenarioResult,
    clearScenario,
  } = useRiskStore();

  useEffect(() => {
    // Component yüklendiğinde ilk tahmini al
    if (!result && !loading) {
      fetchPrediction();
    }
  }, [result, loading, fetchPrediction]);

  if (loading && !result) return <DashboardSkeleton />;
  if (!result) return null;

  // Aktif sonuç: senaryo aktifse senaryo sonucunu, değilse orijinal sonucu kullan
  const activeResult = isScenarioActive && scenarioResult ? scenarioResult : result;

  const isApproved = activeResult.prediction === 0;
  const riskScore = Math.round(activeResult.risk_probability * 100);
  const originalRiskScore = Math.round(result.risk_probability * 100);

  // Karşılaştırmalı chart verisi hazırlama
  const chartData = (() => {
    if (isScenarioActive && scenarioResult) {
      // Tüm feature'ları birleştir (sıralama senaryo sonucuna göre)
      const allFeatures = new Set([
        ...scenarioResult.top_explanations.map(e => e.feature),
        ...result.top_explanations.map(e => e.feature),
      ]);

      return Array.from(allFeatures).map(feature => {
        const origExp = result.top_explanations.find(e => e.feature === feature);
        const scenExp = scenarioResult.top_explanations.find(e => e.feature === feature);
        return {
          feature,
          contribution: origExp?.importance ?? 0,
          scenarioContribution: scenExp?.importance ?? 0,
          shapDirection: scenExp?.shap_value ?? 0, // Yönlü SHAP (renklendirme için)
        };
      }).sort((a, b) => b.scenarioContribution - a.scenarioContribution);
    }

    // Normal mod — sadece orijinal veriler
    return activeResult.top_explanations.map(exp => ({
      feature: exp.feature,
      contribution: exp.importance,
      scenarioContribution: undefined as number | undefined,
      shapDirection: exp.shap_value ?? 0, // Yönlü SHAP (renklendirme için)
    }));
  })();

  return (
    <div className="space-y-6">
      {/* Scenario Active Global Banner */}
      {isScenarioActive && (
        <div
          className="px-5 py-3.5 rounded-2xl flex items-center justify-between animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.06))',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            boxShadow: '0 2px 12px rgba(245, 158, 11, 0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}
            >
              <FlaskConical size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#d97706' }}>
                ⚗️ Senaryo Modu Aktif
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Tüm grafikler ve göstergeler simüle edilmiş sonuçları yansıtmaktadır.
                Orijinal risk: <strong>{originalRiskScore}</strong> → Senaryo risk: <strong>{riskScore}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={clearScenario}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-80"
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#d97706',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <RotateCcw size={13} />
            Orijinale Dön
          </button>
        </div>
      )}

      <PageHeader
        title="Operasyon Görünümü"
        description="Başvuru risk analizi, XAI açıklamaları ve senaryo simülasyonu."
        badge={<RiskBadge score={riskScore} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Risk Skoru"
          value={riskScore}
          description={
            isScenarioActive
              ? `Orijinal: ${originalRiskScore} → Senaryo: ${riskScore}`
              : '100 üzerinden hesaplanan risk olasılığı'
          }
          icon={<Activity size={20} />}
          color={riskScore >= 70 ? 'red' : riskScore >= 40 ? 'amber' : 'emerald'}
        />
        <StatCard
          label="Model Kararı"
          value={isApproved ? 'Onaylandı' : 'Reddedildi'}
          description={`Karar: ${activeResult.risk_label}`}
          icon={isApproved ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
          color={isApproved ? 'emerald' : 'red'}
        />
        <StatCard
          label="Açıklayıcı Faktörler"
          value={activeResult.top_explanations.length}
          description="Model tarafından ağırlıklı özellikler"
          icon={<Activity size={20} />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Risk Gauge — dual comparison when scenario is active */}
        <div className="card p-6 flex flex-col items-center justify-center col-span-2">
          {isScenarioActive ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Risk Karşılaştırması
              </p>
              <div className="flex items-end gap-6">
                <div className="opacity-50">
                  <RiskGauge score={originalRiskScore} label="ORİJİNAL" />
                </div>
                <div className="text-lg font-bold" style={{ color: 'var(--text-muted)' }}>→</div>
                <div>
                  <RiskGauge score={riskScore} label="SENARYO" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <RiskBadge score={riskScore} />
                {riskScore !== originalRiskScore && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: riskScore < originalRiskScore ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: riskScore < originalRiskScore ? '#10b981' : '#ef4444',
                    }}
                  >
                    {riskScore < originalRiskScore ? '↓' : '↑'} {Math.abs(riskScore - originalRiskScore)} puan
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Risk Göstergesi
              </p>
              <RiskGauge score={riskScore} />
              <div className="mt-3">
                <RiskBadge score={riskScore} />
              </div>
            </>
          )}
        </div>

        {/* SHAP Chart — grouped bars when scenario is active */}
        <div className="card p-6 col-span-3">
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Karara Etki Eden Faktörler
            {isScenarioActive && (
              <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
                Karşılaştırma Modu
              </span>
            )}
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            {isScenarioActive
              ? 'Model Özellik Önem Dereceleri — Orijinal vs Senaryo'
              : 'Model Özellik Önem Dereceleri (XAI)'}
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" width={145}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />

                {isScenarioActive ? (
                  <>
                    <Bar dataKey="contribution" name="Orijinal" radius={[0, 4, 4, 0]} maxBarSize={12} fill="#94a3b8" opacity={0.5} />
                    <Bar dataKey="scenarioContribution" name="Senaryo" radius={[0, 6, 6, 0]} maxBarSize={14}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={
                          entry.shapDirection >= 0
                            ? '#ef4444'
                            : '#10b981'
                        } />
                      ))}
                    </Bar>
                  </>
                ) : (
                  <Bar dataKey="contribution" radius={[0, 6, 6, 0]} maxBarSize={18}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.shapDirection >= 0 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-5 text-xs justify-center" style={{ color: 'var(--text-muted)' }}>
            {isScenarioActive ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#94a3b8', opacity: 0.5 }} /> Orijinal Etki
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#ef4444' }} /> Risk Artırıcı (Senaryo SHAP)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#10b981' }} /> Risk Azaltıcı (Senaryo SHAP)
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#ef4444' }} /> Risk Artırıcı (SHAP +)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#10b981' }} /> Risk Azaltıcı (SHAP −)
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CreditRiskPredictionForm />
      <WhatIfModule />
      <FeedbackWidget />
    </div>
  );
}
