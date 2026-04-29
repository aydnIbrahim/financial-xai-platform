'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, CartesianGrid, ZAxis,
} from 'recharts';
import { FeedbackWidget } from '@/features/feedback/components/FeedbackWidget';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, Sigma, Cpu } from 'lucide-react';

import { useRiskStore } from '@/store/useRiskStore';

const dependenceData = Array.from({ length: 50 }).map(() => ({
  x: Math.random() * 100,
  y: (Math.random() - 0.5) * 2,
  z: Math.random() * 100,
}));

function ShapTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; impact: string } }> }) {
  if (!active || !payload?.length) return null;
  const { value, payload: d } = payload[0];
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
      <p style={{ color: d.impact === 'negative' ? 'var(--danger)' : 'var(--primary)' }}>
        SHAP: {value.toFixed(4)}
      </p>
    </div>
  );
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-lg space-y-0.5">
      {payload.map(p => (
        <p key={p.name} style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold">{p.name}:</span> {Number(p.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

export function AnalystDashboard() {
  const { result, loading, fetchPrediction } = useRiskStore();

  useEffect(() => {
    if (!result && !loading) {
      fetchPrediction();
    }
  }, [result, loading, fetchPrediction]);

  if (loading && !result) return <DashboardSkeleton />;
  if (!result) return null;

  // Global etkiyi göstermek için mock impact
  const shapFeatures = result.top_explanations.map(exp => ({
    name: exp.feature,
    value: exp.importance,
    impact: result.prediction === 1 ? 'negative' : 'positive'
  }));

  const negCount = shapFeatures.filter(f => f.impact === 'negative').length;
  const posCount = shapFeatures.length - negCount;
  const baseValue = result.risk_probability;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analist Paneli"
        description="Modelin iç işleyişine dair detaylı XAI metrikleri ve global özellik önem dereceleri."
        badge={<Badge variant="primary">SHAP + Dependence</Badge>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Base Value (Olasılık)"
          value={baseValue.toFixed(4)}
          description="Modelin güncel tahmin olasılığı"
          icon={<Sigma size={20} />}
          color="indigo"
        />
        <StatCard
          label="Risk Artıran Özellikler"
          value={negCount}
          description="Negatif etki yönündeki faktörler"
          icon={<BarChart2 size={20} />}
          color="red"
          trend="up"
        />
        <StatCard
          label="Risk Azaltan Özellikler"
          value={posCount}
          description="Pozitif etki yönündeki faktörler"
          icon={<Cpu size={20} />}
          color="emerald"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SHAP Bar Chart */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Özellik Önem Dereceleri (API)
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>SHAP — Ortalama Mutlak Değer</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={shapFeatures} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={130}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ShapTooltip />} cursor={{ fill: 'var(--surface-hover)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={16}>
                  {shapFeatures.map((entry, i) => (
                    <Cell key={i} fill={entry.impact === 'negative' ? '#ef4444' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex gap-5 text-xs justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-indigo-500" /> Risk Azaltan</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-red-500" /> Risk Artıran</div>
          </div>
        </div>

        {/* Dependence Plot */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Özellik Etkileşim Haritası <span className="text-xs opacity-50">(Örnek Veri)</span>
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Dependence Plot — Gelir/Borç Oranı × SHAP
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis type="number" dataKey="x" name="Özellik Değeri"
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="SHAP Değeri"
                  tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="z" range={[30, 250]} name="Etkileşim" />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Veri Noktaları" data={dependenceData} fill="#6366f1" opacity={0.55} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <FeedbackWidget />
    </div>
  );
}
