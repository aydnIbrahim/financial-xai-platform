'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WhatIfModule } from '@/features/what-if/components/WhatIfModule';

type DecisionData = {
  decision: 'APPROVED' | 'REJECTED';
  riskScore: number;
  riskLabel: string;
};

type LimeData = {
  localExplanations: Array<{ feature: string; contribution: number }>;
};

export function SpecialistDashboard() {
  const [decision, setDecision] = useState<DecisionData | null>(null);
  const [lime, setLime] = useState<LimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/decision').then(r => r.json()),
      fetch('/api/explanations/lime').then(r => r.json())
    ]).then(([decisionData, limeData]) => {
      setDecision(decisionData);
      setLime(limeData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;
  if (!decision || !lime) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Operasyon Görünümü</h2>
          <p className="text-gray-500 text-sm">Başvuru Risk Analizi</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-indigo-600">Skor: {decision.riskScore}</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${decision.riskScore > 60 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {decision.riskLabel}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Karara Etki Eden Faktörler (LIME)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={lime.localExplanations} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={150} tick={{fontSize: 12}} />
              <Tooltip formatter={(value: number) => value.toFixed(3)} />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {lime.localExplanations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.contribution > 0 ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-4 text-sm text-gray-600 justify-center">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Riski Artıranlar (Kırmızı)</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Riski Düşürenler (Yeşil)</div>
        </div>
      </div>

      <WhatIfModule />
    </div>
  );
}
