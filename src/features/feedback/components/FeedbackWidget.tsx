'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function FeedbackWidget() {
  const { user } = useAuthStore();
  const [feedbackState, setFeedbackState] = useState<'liked' | 'disliked' | null>(null);
  const [comment, setComment]             = useState('');
  const [submitted, setSubmitted]         = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackState(null);
      setComment('');
    }, 3000);
  };

  const isExpert = user?.role === 'SPECIALIST' || user?.role === 'ANALYST';

  if (submitted) {
    return (
      <div
        className="card p-5 flex items-center gap-3 animate-fade-in"
        style={{ borderLeft: '3px solid var(--success)' }}
      >
        <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Değerli geri bildiriminiz için teşekkür ederiz! Yapay zeka sistemimiz bu sayede gelişmeye devam edecektir.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Bu açıklama sizin için ne kadar faydalı oldu?
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <button
          id="feedback-like"
          onClick={() => setFeedbackState('liked')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
          style={
            feedbackState === 'liked'
              ? { background: 'var(--success-light)', borderColor: '#6ee7b7', color: 'var(--success)' }
              : { background: 'var(--surface-hover)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
          }
        >
          <ThumbsUp size={16} />
          Faydalı
        </button>
        <button
          id="feedback-dislike"
          onClick={() => setFeedbackState('disliked')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
          style={
            feedbackState === 'disliked'
              ? { background: 'var(--danger-light)', borderColor: '#fca5a5', color: 'var(--danger)' }
              : { background: 'var(--surface-hover)', borderColor: 'var(--border)', color: 'var(--text-muted)' }
          }
        >
          <ThumbsDown size={16} />
          Faydalı Değil
        </button>
      </div>

      {feedbackState && isExpert && (
        <div className="animate-fade-in space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Uzman Görüşü / Açıklama Ekle (Opsiyonel)
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-xl text-sm p-3 resize-none transition-all duration-200"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            placeholder="Kararın yanlış olduğunu düşünüyorsanız lütfen gerekçenizi buraya yazın..."
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }}
          />
          <button
            id="feedback-submit-expert"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #818cf8)',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            Geri Bildirimi Gönder
          </button>
        </div>
      )}

      {feedbackState && !isExpert && (
        <button
          id="feedback-submit-customer"
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          Gönder
        </button>
      )}
    </div>
  );
}
