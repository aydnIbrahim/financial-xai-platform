'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  BrainCircuit,
  ChevronRight,
} from 'lucide-react';

/* ─── Role metadata ─── */
const ROLE_META: Record<string, { label: string; initials: string; color: string; dot: string }> = {
  CUSTOMER:   { label: 'Müşteri',          initials: 'MÜ', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', dot: 'bg-emerald-400' },
  SPECIALIST: { label: 'Kredi Uzmanı',     initials: 'KU', color: 'bg-indigo-500/20  text-indigo-300  border border-indigo-500/30',  dot: 'bg-indigo-400'  },
  ANALYST:    { label: 'Veri Bilimcisi',   initials: 'VB', color: 'bg-purple-500/20  text-purple-300  border border-purple-500/30',  dot: 'bg-purple-400'  },
};

/* ─── Nav Item ─── */
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 group
        ${active
          ? 'bg-[var(--primary)] text-white shadow-lg'
          : 'text-[var(--sidebar-text)] hover:bg-white/6 hover:text-white'
        }
      `}
    >
      {/* Active indicator line */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white/60 rounded-r" />
      )}
      <span className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {active && <ChevronRight size={14} className="opacity-60" />}
    </Link>
  );
}

/* ─── AppShell ─── */
interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const role     = user?.role ?? 'CUSTOMER';
  const roleMeta = ROLE_META[role] ?? ROLE_META.CUSTOMER;
  const initial  = user?.name?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-72 flex-shrink-0 flex flex-col overflow-y-auto"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--primary)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
            >
              <BrainCircuit size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight tracking-wide">FinXAI</p>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--sidebar-text)' }}>
                Açıklanabilir Karar Destek
              </p>
            </div>
          </div>
        </div>

        {/* User card */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, var(--primary), #818cf8)' }}
            >
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate leading-snug">
                {user?.name ?? 'Kullanıcı'}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleMeta.color}`}>
                {roleMeta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest font-semibold px-3 mb-2"
             style={{ color: 'rgba(148,163,184,0.5)' }}>
            Menü
          </p>

          <NavItem
            href="/"
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            active={pathname === '/'}
          />

          {(role === 'SPECIALIST' || role === 'ANALYST') && (
            <NavItem
              href="/audit"
              icon={<ClipboardList size={16} />}
              label="Denetim Kayıtları"
              active={pathname === '/audit'}
            />
          )}
        </nav>

        {/* Footer / Logout */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            id="logout-button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       transition-all duration-200 group"
            style={{ color: 'var(--sidebar-text)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--sidebar-text)';
            }}
          >
            <LogOut size={16} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
