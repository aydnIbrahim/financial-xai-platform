import { create } from 'zustand';

export type CustomerData = {
  LIMIT_BAL: number;
  AGE: number;
  PAY_0: number;
  PAY_2: number;
  PAY_3: number;
  PAY_4: number;
  PAY_5: number;
  PAY_6: number;
  BILL_AMT1: number;
  BILL_AMT2: number;
  BILL_AMT3: number;
  BILL_AMT4: number;
  BILL_AMT5: number;
  BILL_AMT6: number;
  PAY_AMT1: number;
  PAY_AMT2: number;
  PAY_AMT3: number;
  PAY_AMT4: number;
  PAY_AMT5: number;
  PAY_AMT6: number;
};

export const defaultCustomerData: CustomerData = {
  LIMIT_BAL: 20000,
  AGE: 24,
  PAY_0: 2,
  PAY_2: 2,
  PAY_3: 0,
  PAY_4: 0,
  PAY_5: 0,
  PAY_6: 0,
  BILL_AMT1: 3913,
  BILL_AMT2: 3102,
  BILL_AMT3: 689,
  BILL_AMT4: 0,
  BILL_AMT5: 0,
  BILL_AMT6: 0,
  PAY_AMT1: 0,
  PAY_AMT2: 689,
  PAY_AMT3: 0,
  PAY_AMT4: 0,
  PAY_AMT5: 0,
  PAY_AMT6: 0
};

export type PredictionResult = {
  prediction: number;
  risk_probability: number;
  risk_label: string;
  top_explanations: Array<{
    feature: string;
    value: number;
    importance: number;
  }>;
};

type RiskStore = {
  customerData: CustomerData;
  setCustomerData: (data: Partial<CustomerData>) => void;
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
  fetchPrediction: (customData?: CustomerData) => Promise<PredictionResult>;
};

export const useRiskStore = create<RiskStore>((set, get) => ({
  customerData: defaultCustomerData,
  setCustomerData: (data) => set((state) => ({ customerData: { ...state.customerData, ...data } })),
  result: null,
  loading: false,
  error: null,
  fetchPrediction: async (customData?: CustomerData) => {
    set({ loading: true, error: null });
    try {
      const dataToPredict = customData || get().customerData;
      const response = await fetch("https://unsent-spruce-washbowl.ngrok-free.dev/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToPredict)
      });
      if (!response.ok) throw new Error("API yanıt vermedi veya ngrok linki aktif değil.");
      const data = await response.json();
      
      // Sadece ana müşteri verisi için store'u güncelle (what-if simülasyonları için state'i kirletmemek adına)
      if (!customData) {
        set({ result: data, loading: false });
      } else {
        set({ loading: false });
      }
      
      return data;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
