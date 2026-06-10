'use client';

import { useEffect } from 'react';
import { FeedbackWidget } from '@/features/feedback/components/FeedbackWidget';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

import { useRiskStore } from '@/store/useRiskStore';

export function CustomerDashboard() {
  const {
    result,
    loading,
    fetchPrediction,
    isScenarioActive,
    scenarioResult,
  } = useRiskStore();

  useEffect(() => {
    if (!result && !loading) {
      fetchPrediction();
    }
  }, [result, loading, fetchPrediction]);

  if (loading && !result) return <DashboardSkeleton />;
  if (!result) return null;

  // Aktif sonuç: senaryo aktifse senaryo, değilse orijinal
  const activeResult = isScenarioActive && scenarioResult ? scenarioResult : result;

  const isApproved = activeResult.prediction === 0;
  const riskPct    = Math.round(activeResult.risk_probability * 100);

  const decisionCfg = isApproved
    ? {
        icon:     <CheckCircle size={40} className="text-emerald-500" />,
        label:    'Başvurunuz Onaylandı',
        sublabel: 'Tebrikler! Kredi başvurunuz olumlu değerlendirildi.',
        bg:       'from-emerald-50 to-teal-50',
        border:   'border-emerald-200',
        badgeBg:  'bg-emerald-100 text-emerald-700',
        barColor: '#10b981',
      }
    : {
        icon:     <XCircle size={40} className="text-red-500" />,
        label:    'Başvurunuz Reddedildi',
        sublabel: 'Üzgünüz. Başvurunuz mevcut kriterler dahilinde onaylanamadı.',
        bg:       'from-red-50 to-rose-50',
        border:   'border-red-200',
        badgeBg:  'bg-red-100 text-red-700',
        barColor: '#ef4444',
      };

  const topFactor = activeResult.top_explanations[0]?.feature || 'çeşitli finansal faktörler';
  const explanationMessage = `Mevcut finansal verileriniz değerlendirilmiştir. Sistemimiz, özellikle "${topFactor}" değişkenini dikkate alarak başvurunuzun ${isApproved ? 'düşük riskli' : 'yüksek riskli'} olduğuna karar vermiştir.`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Başvuru Sonucunuz"
        description="Kredi başvurunuz yapay zeka modeli tarafından değerlendirilmiştir."
      />

      {/* Decision Card */}
      <div className={`card p-6 bg-gradient-to-br ${decisionCfg.bg} ${decisionCfg.border} animate-fade-in`}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            {decisionCfg.icon}
            <div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {decisionCfg.label}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {decisionCfg.sublabel}
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${decisionCfg.badgeBg}`}>
            {activeResult.risk_label}
          </span>
        </div>

        {/* Risk Score Bar */}
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Risk Skoru (Olasılık)
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {riskPct} / 100
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${riskPct}%`, background: decisionCfg.barColor }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Düşük Risk</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Yüksek Risk</span>
          </div>
        </div>
      </div>

      {/* XAI Explanation */}
      <div className="card p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Info size={16} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Yapay Zeka Açıklaması
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {explanationMessage}
        </p>
      </div>

      {/* Warning note */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl border"
        style={{ background: 'var(--warning-light)', borderColor: '#fde68a' }}
      >
        <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs leading-relaxed text-amber-800">
          Bu karar, yapay zeka modeli tarafından üretilmiştir. Kesin değerlendirme için
          bir kredi uzmanına başvurabilirsiniz.
        </p>
      </div>

      <FeedbackWidget />
    </div>
  );
}
