import React from 'react';

type StatColor = 'indigo' | 'emerald' | 'red' | 'amber' | 'blue' | 'slate';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: StatColor;
  trend?: 'up' | 'down' | 'neutral';
}

const colorMap: Record<StatColor, { icon: string; value: string; border: string }> = {
  indigo:  { icon: 'bg-indigo-100 text-indigo-600',  value: 'text-indigo-700',  border: 'border-indigo-100' },
  emerald: { icon: 'bg-emerald-100 text-emerald-600', value: 'text-emerald-700', border: 'border-emerald-100' },
  red:     { icon: 'bg-red-100 text-red-600',         value: 'text-red-700',     border: 'border-red-100' },
  amber:   { icon: 'bg-amber-100 text-amber-600',     value: 'text-amber-700',   border: 'border-amber-100' },
  blue:    { icon: 'bg-blue-100 text-blue-600',       value: 'text-blue-700',    border: 'border-blue-100' },
  slate:   { icon: 'bg-slate-100 text-slate-600',     value: 'text-slate-700',   border: 'border-slate-100' },
};

const trendIcon: Record<'up' | 'down' | 'neutral', { icon: string; cls: string }> = {
  up:      { icon: '↑', cls: 'text-red-500' },
  down:    { icon: '↓', cls: 'text-emerald-500' },
  neutral: { icon: '→', cls: 'text-slate-400' },
};

export function StatCard({
  label,
  value,
  description,
  icon,
  color = 'indigo',
  trend,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-bold leading-none ${c.value}`}>{value}</p>
          {trend && (
            <span className={`text-sm font-semibold ${trendIcon[trend].cls}`}>
              {trendIcon[trend].icon}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
