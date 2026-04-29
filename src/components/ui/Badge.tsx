import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
  danger:  'bg-red-50    text-red-700    border-red-200    ring-red-100',
  warning: 'bg-amber-50  text-amber-700  border-amber-200  ring-amber-100',
  info:    'bg-blue-50   text-blue-700   border-blue-200   ring-blue-100',
  neutral: 'bg-slate-50  text-slate-600  border-slate-200  ring-slate-100',
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100',
};

const sizeStyles: Record<'sm' | 'md', string> = {
  sm: 'text-[10px] px-2 py-0.5 font-semibold',
  md: 'text-xs    px-2.5 py-1 font-semibold',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border tracking-wide uppercase
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {children}
    </span>
  );
}

/** Shorthand helpers */
export function DecisionBadge({ decision }: { decision: 'APPROVED' | 'REJECTED' }) {
  return (
    <Badge variant={decision === 'APPROVED' ? 'success' : 'danger'}>
      {decision === 'APPROVED' ? '✓ Onaylandı' : '✗ Reddedildi'}
    </Badge>
  );
}

export function RiskBadge({ score }: { score: number }) {
  const variant = score >= 70 ? 'danger' : score >= 40 ? 'warning' : 'success';
  const label   = score >= 70 ? 'Yüksek Risk' : score >= 40 ? 'Orta Risk' : 'Düşük Risk';
  return <Badge variant={variant}>{label}</Badge>;
}
