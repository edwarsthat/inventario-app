import { create } from 'zustand';
import { authService } from '../services/authService';

interface User {
    username: string;
    email?: string;
    name?: string;
    grupos?: string[];
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    checkAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: async (username: string, password: string) => {
        const data = await authService.login(username, password);
        set({ user: { username }, token: data.token, isAuthenticated: true });
    },
    checkAuth: async () => {
        const data = await authService.checkAuth();

        set({ isAuthenticated: data });
    }
}));