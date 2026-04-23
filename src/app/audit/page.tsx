'use client';

import { AuditLogsTable } from '@/features/audit/components/AuditLogsTable';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

export default function AuditLogsPage() {
  const { user } = useAuthStore();

  if (!user || user.role === 'CUSTOMER') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-6">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
          <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Ana Sayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Denetim Kayıtları (Audit Logs)</h1>
            <p className="text-gray-600 mt-2">Sistemde alınan tüm kararlar ve uzman müdahaleleri izlenebilmektedir.</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition font-medium">
            Geri Dön
          </Link>
        </div>
        
        <AuditLogsTable />
      </div>
    </main>
  );
}
