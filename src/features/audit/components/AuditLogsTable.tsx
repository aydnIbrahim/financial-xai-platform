'use client';

import { useState, useEffect } from 'react';
import { DecisionBadge } from '@/components/ui/Badge';
import { X, FileJson } from 'lucide-react';

type AuditLog = {
  id: string;
  timestamp: string;
  decision: 'APPROVED' | 'REJECTED';
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
    originalJson: '{"features":{"income":15000,"debt":8000,"history":"poor"},"shap":{...}}',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-04-23T11:05:00Z',
    decision: 'APPROVED',
    riskScore: 45,
    expertName: 'Selin Kaya',
    expertRole: 'ANALYST',
    feedback: 'Sistem yüksek risk verdi ancak müşteri yeni teminat gösterdiği için onaylandı. (Model Override)',
    originalJson: '{"features":{"income":25000,"debt":5000,"history":"good"},"shap":{...}}',
  },
];

function JsonModal({ json, onClose }: { json: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="card p-6 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileJson size={18} style={{ color: 'var(--primary)' }} />
            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Ham Veri (JSON)</h4>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <X size={15} />
          </button>
        </div>
        <pre
          className="text-xs rounded-xl p-4 overflow-auto max-h-64 leading-relaxed"
          style={{
            background: 'var(--sidebar-bg)',
            color: '#a5f3fc',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {JSON.stringify(JSON.parse(json.replace('{...}', '{}')), null, 2)}
        </pre>
      </div>
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  SPECIALIST: 'Kredi Uzmanı',
  ANALYST:    'Veri Bilimcisi',
};

export function AuditLogsTable() {
  const [logs, setLogs]         = useState<AuditLog[]>([]);
  const [selectedJson, setSelectedJson] = useState<string | null>(null);

  useEffect(() => {
    setLogs(mockLogs);
  }, []);

  return (
    <>
      {selectedJson && (
        <JsonModal json={selectedJson} onClose={() => setSelectedJson(null)} />
      )}

      <div className="card overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {logs.length} kayıt listeleniyor
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--sidebar-bg)' }}>
                {['Tarih / Saat', 'Log ID', 'Karar & Skor', 'Uzman', 'Geri Bildirim / Müdahale', 'Ham Veri'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--sidebar-text)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr
                  key={log.id}
                  className="transition-colors duration-150 group"
                  style={{ borderTop: idx > 0 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {log.id}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <DecisionBadge decision={log.decision} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {log.riskScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{log.expertName}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {ROLE_LABELS[log.expertRole] ?? log.expertRole}
                    </p>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }} title={log.feedback}>
                      {log.feedback || '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedJson(log.originalJson)}
                      className="flex items-center gap-1 text-xs font-semibold transition-colors"
                      style={{ color: 'var(--primary)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary-hover)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)'; }}
                    >
                      <FileJson size={13} />
                      JSON Gör
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
