'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function FeedbackWidget() {
  const { user } = useAuthStore();
  const [feedbackState, setFeedbackState] = useState<'liked' | 'disliked' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Gerçekte burada POST isteği atılır.
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackState(null);
      setComment('');
    }, 3000);
  };

  const isExpert = user?.role === 'SPECIALIST' || user?.role === 'ANALYST';

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 mt-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bu açıklama sizin için ne kadar faydalı oldu?</h3>
      
      {!submitted ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFeedbackState('liked')}
              className={`p-3 rounded-full flex items-center justify-center transition border ${feedbackState === 'liked' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              title="Beğendim"
            >
              <ThumbsUp size={24} />
            </button>
            <button 
              onClick={() => setFeedbackState('disliked')}
              className={`p-3 rounded-full flex items-center justify-center transition border ${feedbackState === 'disliked' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
              title="Beğenmedim"
            >
              <ThumbsDown size={24} />
            </button>
          </div>

          {feedbackState && isExpert && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uzman Görüşü / Açıklama Ekle (Opsiyonel)
              </label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Kararın yanlış olduğunu düşünüyorsanız lütfen gerekçenizi buraya yazın..."
              />
              <button 
                onClick={handleSubmit}
                className="mt-3 px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition"
              >
                Geri Bildirimi Gönder
              </button>
            </div>
          )}
          
          {feedbackState && !isExpert && (
            <button 
              onClick={handleSubmit}
              className="mt-3 w-fit px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Gönder
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 text-center font-medium animate-in fade-in zoom-in duration-300">
          Değerli geri bildiriminiz için teşekkür ederiz! Yapay zeka sistemimiz bu sayede gelişmeye devam edecektir.
        </div>
      )}
    </div>
  );
}
