'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

export default function Home() {
  const { user, login, logout } = useAuthStore();

  if (user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Hoş Geldiniz, {user.name}</h1>
          <p className="text-gray-600 mb-8">
            Aktif Rol: <span className="font-semibold text-blue-600">{user.role}</span>
          </p>
          
          <div className="p-4 bg-gray-100 rounded-lg mb-8">
            {/* BURAYA ROL TABANLI DASHBOARD BİLEŞENLERİ GELECEK */}
            <p className="text-sm text-gray-500 italic">
              {user.role === 'CUSTOMER' && "Sadece onay/ret ve basit metin gösterilecek."}
              {user.role === 'SPECIALIST' && "LIME grafikleri ve What-If senaryoları yüklenecek."}
              {user.role === 'ANALYST' && "Tam SHAP matrisi ve model bağımlılıkları yüklenecek."}
            </p>
          </div>

          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Çıkış Yap
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sisteme Giriş (Mock)
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Test etmek istediğiniz kullanıcı rolünü seçin:
        </p>

        <div className="flex flex-col gap-4">
          <button onClick={() => login('CUSTOMER')} className="w-full py-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-medium">
            Müşteri (Son Kullanıcı)
          </button>
          <button onClick={() => login('SPECIALIST')} className="w-full py-3 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition font-medium">
            Kredi Operasyon Uzmanı
          </button>
          <button onClick={() => login('ANALYST')} className="w-full py-3 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition font-medium">
            Veri Bilimcisi / Analist
          </button>
        </div>
      </div>
    </main>
  );
}