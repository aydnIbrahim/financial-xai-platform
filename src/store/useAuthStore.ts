import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const MOCK_USERS: Record<UserRole, User> = {
  CUSTOMER: { id: '1', name: 'Ahmet Yılmaz', role: 'CUSTOMER' },
  SPECIALIST: { id: '2', name: 'Ayşe Kaya (Kredi Uzmanı)', role: 'SPECIALIST' },
  ANALYST: { id: '3', name: 'Dr. Can Demir (Veri Bilimcisi)', role: 'ANALYST' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null, 
  login: (role) => set({ user: MOCK_USERS[role] }),
  logout: () => set({ user: null }),
}));