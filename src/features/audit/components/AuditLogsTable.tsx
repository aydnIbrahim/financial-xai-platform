'use client';

import { useState, useEffect } from 'react';

type AuditLog = {
  id: string;
  timestamp: string;
  decision: string;
  riskScore: number;
  expertName: string;
  expertRole: string;
  feedback: string;
  originalJson: string;
};

const mockLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-04-23T10:15:00Z',
    decision: 'REJECTED',
    riskScore: 78,
    expertName: 'Ahmet Yılmaz',
    expertRole: 'SPECIALIST',
    feedback: 'Gelir/borç oranı sınırda, ancak kredi geçmişi sorunlu olduğu için reddedildi.',
    originalJson: '{"features":{"income":15000,"debt":8000,"history":"poor"},"shap":{...}}'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-04-23T11:05:00Z',
    decision: 'APPROVED',
    riskScore: 45,
    expertName: 'Selin Kaya',
    expertRole: 'ANALYST',
    feedback: 'Sistem yüksek risk verdi ancak müşteri yeni teminat gösterdiği için onaylandı. (Model Override)',
    originalJson: '{"features":{"income":25000,"debt":5000,"history":"good"},"shap":{...}}'
  }
];

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Mock API call
    setLogs(mockLogs);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Tarih / Saat</th>
              <th className="px-6 py-4">Log ID</th>
              <th className="px-6 py-4">Karar & Skor</th>
              <th className="px-6 py-4">Uzman</th>
              <th className="px-6 py-4">Geri Bildirim / Müdahale</th>
              <th className="px-6 py-4">Ham Veri</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('tr-TR')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {log.id}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${log.decision === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.decision}
                  </span>
                  ({log.riskScore})
                </td>
                <td className="px-6 py-4">
                  <div>{log.expertName}</div>
                  <div className="text-xs text-gray-400">{log.expertRole}</div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={log.feedback}>
                  {log.feedback || '-'}
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:underline text-xs">JSON Gör</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
