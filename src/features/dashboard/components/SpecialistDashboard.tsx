'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WhatIfModule } from '@/features/what-if/components/WhatIfModule';
import { CreditRiskPredictionForm } from './CreditRiskPredictionForm';
import { FeedbackWidget } from '@/features/feedback/components/FeedbackWidget';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { RiskBadge } from '@/components/ui/Badge';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { useRiskStore } from '@/store/useRiskStore';

type DecisionData = {
  decision: 'APPROVED' | 'REJECTED';
  riskScore: number;
  riskLabel: string;
};

type LimeData = {
  localExplanations: Array<{ feature: string; contribution: number }>;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="card px-3 py-2 text-xs font-semibold shadow-lg">
      <span style={{ color: val > 0 ? 'var(--danger)' : 'var(--success)' }}>
        {val > 0 ? '+' : ''}{val.toFixed(3)}
      </span>
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const r       = 52;
  const circ    = 2 * Math.PI * r;
  const pct     = score / 100;
  const dashOff = circ * (1 - pct * 0.75);
  const color   = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981';

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
              fontFamily="inherit" fontWeight="600" letterSpacing="0.05em">RİSK SKORU</text>
      </svg>
    </div>
  );
}

export function SpecialistDashboard() {
  const { customerData, result, loading, error, fetchPrediction } = useRiskStore();

  useEffect(() => {
    // Component yüklendiğinde ilk tahmini al
    if (!result && !loading) {
      fetchPrediction();
    }
  }, [result, loading, fetchPrediction]);

  if (loading && !result) return <DashboardSkeleton />;
  if (!result) return null;

  const isApproved = result.prediction === 0; // 0: Risksiz (Onaylandı), 1: Riskli (Reddedildi)
  const riskScore = Math.round(result.risk_probability * 100);

  // API'den gelen önem derecelerini LIME formatına dönüştür
  const chartData = result.top_explanations.map(exp => ({
    feature: exp.feature,
    contribution: exp.importance // Eğer API hep pozitif dönüyorsa hepsi aynı yönde çizer, risk yönüne göre renklendirilebilir ama şimdilik doğrudan kullanıyoruz.
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operasyon Görünümü"
        description="Başvuru risk analizi, XAI açıklamaları ve senaryo simülasyonu."
        badge={<RiskBadge score={riskScore} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Risk Skoru"
          value={riskScore}
          description="100 üzerinden hesaplanan risk olasılığı"
          icon={<Activity size={20} />}
          color={riskScore >= 70 ? 'red' : riskScore >= 40 ? 'amber' : 'emerald'}
        />
        <StatCard
          label="Model Kararı"
          value={isApproved ? 'Onaylandı' : 'Reddedildi'}
          description={`Karar: ${result.risk_label}`}
          icon={isApproved ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
          color={isApproved ? 'emerald' : 'red'}
        />
        <StatCard
          label="Açıklayıcı Faktörler"
          value={result.top_explanations.length}
          description="Model tarafından ağırlıklı özellikler"
          icon={<Activity size={20} />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="card p-6 flex flex-col items-center justify-center col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Risk Göstergesi
          </p>
          <RiskGauge score={riskScore} />
          <div className="mt-3">
            <RiskBadge score={riskScore} />
          </div>
        </div>

        <div className="card p-6 col-span-3">
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Karara Etki Eden Faktörler
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Model Özellik Önem Dereceleri (XAI)</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" width={145}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
                <Bar dataKey="contribution" radius={[0, 6, 6, 0]} maxBarSize={18}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.contribution > 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-5 text-xs justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#ef4444' }} /> Etki Derecesi (Pozitif)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#10b981' }} /> Etki Derecesi (Negatif)
            </div>
          </div>
        </div>
      </div>

      <CreditRiskPredictionForm />
      <WhatIfModule />
      <FeedbackWidget />
    </div>
  );
}
