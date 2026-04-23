'use client';

import { useEffect, useState } from 'react';
import { FeedbackWidget } from '@/features/feedback/components/FeedbackWidget';

type DecisionData = {
  decision: 'APPROVED' | 'REJECTED';
  riskScore: number;
  riskLabel: string;
  message: string;
};

export function CustomerDashboard() {
  const [data, setData] = useState<DecisionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/decision')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;
  if (!data) return null;

  const isApproved = data.decision === 'APPROVED';

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Kredi Başvuru Sonucu</h2>
      
      <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${isApproved ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
        <div>
          <p className="text-sm font-semibold uppercase opacity-80">Durum</p>
          <p className="text-2xl font-bold">{isApproved ? 'Onaylandı' : 'Onaylanmadı'}</p>
        </div>
        <div className={`text-4xl ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
          {isApproved ? '✓' : '✗'}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-2">Açıklama</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          {data.message}
        </p>
      </div>

      <FeedbackWidget />
    </div>
  );
}
