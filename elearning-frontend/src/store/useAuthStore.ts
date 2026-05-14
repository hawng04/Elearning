import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User , token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false, 
      
      login: (user, token) => {
        localStorage.setItem('token', token); 
        set({ user, isAuthenticated: true }); 
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);

