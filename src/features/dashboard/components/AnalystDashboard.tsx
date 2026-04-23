'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, CartesianGrid, ZAxis } from 'recharts';

type ShapData = {
  features: Array<{ name: string; value: number; impact: 'positive' | 'negative' }>;
  baseValue: number;
};

// Mock data for Dependence Plot
const dependenceData = Array.from({ length: 50 }).map(() => ({
  x: Math.random() * 100,
  y: (Math.random() - 0.5) * 2,
  z: Math.random() * 100 // for color/size coding
}));

export function AnalystDashboard() {
  const [shap, setShap] = useState<ShapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explanations/shap')
      .then(r => r.json())
      .then(data => {
        setShap(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;
  if (!shap) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Veri Bilimcisi / Analist Paneli</h2>
        <p className="text-gray-600 mb-6">Modelin iç işleyişine dair detaylı XAI metrikleri.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global SHAP Bar Chart */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-4 text-gray-700 text-center">Global Özellik Önem Dereceleri (SHAP)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={shap.features} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                  <Tooltip formatter={(value: number) => value.toFixed(3)} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {shap.features.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact === 'negative' ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">X Ekseni: Ortalama Mutlak SHAP Değeri</p>
          </div>

          {/* Dependence Plot Mock */}
          <div className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-4 text-gray-700 text-center">Özellik Etkileşim Haritası (Dependence Plot)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Özellik Değeri" />
                  <YAxis type="number" dataKey="y" name="SHAP Değeri" />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} name="Etkileşim" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Veri Noktaları" data={dependenceData} fill="#8884d8" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">Örnek: Gelir-Borç Oranı vs SHAP Değeri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
