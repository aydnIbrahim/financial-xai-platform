export type UserRole = 'CUSTOMER' | 'SPECIALIST' | 'ANALYST';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}