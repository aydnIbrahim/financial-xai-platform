'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { AppShell } from '@/components/layout/AppShell';
import { CustomerDashboard } from '@/features/dashboard/components/CustomerDashboard';
import { SpecialistDashboard } from '@/features/dashboard/components/SpecialistDashboard';
import { AnalystDashboard } from '@/features/dashboard/components/AnalystDashboard';
import { BrainCircuit, TrendingUp, ShieldCheck, Users } from 'lucide-react';

/* ─── Role config for login cards ─── */
const ROLES = [
  {
    id: 'CUSTOMER' as const,
    label: 'Müşteri',
    sublabel: 'Son Kullanıcı',
    description: 'Kredi başvurusunun sonucunu ve AI açıklamasını görüntüleyin.',
    icon: <Users size={22} />,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'hover:bg-emerald-50 border-emerald-100 hover:border-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-600',
    textColor: 'text-emerald-700',
  },
  {
    id: 'SPECIALIST' as const,
    label: 'Kredi Uzmanı',
    sublabel: 'Operasyon',
    description: 'LIME açıklamaları, risk analizi ve senaryo simülasyonlarını yönetin.',
    icon: <TrendingUp size={22} />,
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'hover:bg-indigo-50 border-indigo-100 hover:border-indigo-300',
    iconBg: 'bg-indigo-100 text-indigo-600',
    textColor: 'text-indigo-700',
  },
  {
    id: 'ANALYST' as const,
    label: 'Veri Bilimcisi',
    sublabel: 'Analist',
    description: 'Global SHAP değerleri, dependence plot ve model metriklerini inceleyin.',
    icon: <ShieldCheck size={22} />,
    gradient: 'from-purple-500 to-fuchsia-500',
    bg: 'hover:bg-purple-50 border-purple-100 hover:border-purple-300',
    iconBg: 'bg-purple-100 text-purple-600',
    textColor: 'text-purple-700',
  },
] as const;

/* ─── LOGIN PAGE ─── */
function LoginPage() {
  const { login } = useAuthStore();

  return (
    <div className="flex min-h-screen">

      {/* Left — Branding Panel */}
      <div
        className="hidden lg:flex w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: '#818cf8' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--primary)', boxShadow: '0 4px 15px rgba(99,102,241,0.5)' }}
          >
            <BrainCircuit size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">FinXAI</span>
        </div>

        {/* Main text */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Şeffaf ve<br />
            <span style={{ color: '#818cf8' }}>Açıklanabilir</span><br />
            Finansal Kararlar
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            XAITK tabanlı insan–makine takımlaşması ile her finansal kararın arkasındaki
            nedenleri anlayın ve denetleyin.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-2">
            {['LIME & SHAP Açıklamaları', 'What-If Senaryo Simülasyonu', 'Tam Denetlenebilir Audit Log'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-slate-600">
          Marmara Üniversitesi · Bitirme Projesi © 2026
        </p>
      </div>

      {/* Right — Login Panel */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ background: 'var(--background)' }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'var(--primary)' }}>
              <BrainCircuit size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>FinXAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Sisteme Giriş
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Demo için test etmek istediğiniz kullanıcı rolünü seçin
            </p>
          </div>

          <div className="space-y-3">
            {ROLES.map((role) => (
              <button
                key={role.id}
                id={`login-${role.id.toLowerCase()}`}
                onClick={() => login(role.id)}
                className={`
                  w-full text-left p-4 rounded-xl border bg-white
                  transition-all duration-200 group
                  ${role.bg}
                `}
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${role.iconBg}`}>
                    {role.icon}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={`font-semibold text-sm ${role.textColor}`}>{role.label}</span>
                      <span className="text-xs text-[var(--text-muted)]">{role.sublabel}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Bu giriş sistemi demo amaçlıdır. Gerçek kimlik doğrulama içermez.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const { user } = useAuthStore();

  if (!user) return <LoginPage />;

  return (
    <AppShell>
      <div className="animate-fade-in">
        {user.role === 'CUSTOMER'   && <CustomerDashboard />}
        {user.role === 'SPECIALIST' && <SpecialistDashboard />}
        {user.role === 'ANALYST'    && <AnalystDashboard />}
      </div>
    </AppShell>
  );
}