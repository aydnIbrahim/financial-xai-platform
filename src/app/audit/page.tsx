'use client';

import { AuditLogsTable } from '@/features/audit/components/AuditLogsTable';
import { useAuthStore } from '@/store/useAuthStore';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AuditLogsPage() {
  const { user } = useAuthStore();

  /* ── Unauthorised ── */
  if (!user || user.role === 'CUSTOMER') {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-8"
        style={{ background: 'var(--background)' }}
      >
        <div className="card p-10 text-center max-w-md w-full animate-fade-in">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}
          >
            <ShieldOff size={30} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Yetkisiz Erişim
          </h1>
          <p className="text-sm mb-7" style={{ color: 'var(--text-secondary)' }}>
            Bu sayfayı görüntülemek için Kredi Uzmanı veya Analist yetkisine sahip olmanız gerekmektedir.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <ArrowLeft size={15} />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  /* ── Authorised ── */
  return (
    <AppShell>
      <div className="animate-fade-in">
        <PageHeader
          title="Denetim Kayıtları"
          description="Sistemde alınan tüm kararlar ve uzman müdahaleleri şeffaf biçimde izlenebilmektedir."
          badge={<Badge variant="neutral">Audit Log</Badge>}
          actions={
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                background: 'var(--surface)',
              }}
            >
              <ArrowLeft size={14} />
              Geri Dön
            </Link>
          }
        />

        <AuditLogsTable />
      </div>
    </AppShell>
  );
}
