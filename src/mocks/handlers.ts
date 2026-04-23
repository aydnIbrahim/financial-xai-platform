import { http, HttpResponse } from 'msw';

export const handlers = [
  // Karar (Decision) API
  http.get('/api/decision', () => {
    return HttpResponse.json({
      decision: 'REJECTED',
      riskScore: 78,
      riskLabel: 'Yüksek Risk',
      message: 'Gelir-borç oranınız sınırın üstünde olduğu için onaylanmadı.',
    });
  }),

  // SHAP Değerleri API (Analist için)
  http.get('/api/explanations/shap', () => {
    return HttpResponse.json({
      features: [
        { name: 'Gelir-Borç Oranı', value: 0.35, impact: 'negative' },
        { name: 'Kredi Geçmişi', value: -0.15, impact: 'positive' },
        { name: 'Aylık Gelir', value: -0.10, impact: 'positive' },
        { name: 'İstenen Kredi Tutarı', value: 0.20, impact: 'negative' },
        { name: 'Vade (Ay)', value: 0.05, impact: 'negative' },
      ],
      baseValue: 0.5,
    });
  }),

  // LIME Değerleri API (Uzman için)
  http.get('/api/explanations/lime', () => {
    return HttpResponse.json({
      localExplanations: [
        { feature: 'Gelir-Borç Oranı > %40', contribution: 0.25 },
        { feature: 'Kredi Geçmişi = İyi', contribution: -0.10 },
        { feature: 'Aylık Gelir < 20000', contribution: 0.15 },
      ],
    });
  }),

  // What-If Senaryo API
  http.post('/api/simulate', async ({ request }) => {
    const data = await request.json() as any;
    
    // Basit bir mock mantığı: Gelir artarsa risk düşer.
    let newScore = 78;
    if (data.income > 20000) {
      newScore = 45;
    }

    return HttpResponse.json({
      decision: newScore > 60 ? 'REJECTED' : 'APPROVED',
      riskScore: newScore,
      riskLabel: newScore > 60 ? 'Yüksek Risk' : 'Düşük Risk',
      message: newScore > 60 
        ? 'Risk hala yüksek, kredi onaylanmadı.' 
        : 'Gelir artışı ile risk düştü, kredi onaylanabilir.',
    });
  }),
];
