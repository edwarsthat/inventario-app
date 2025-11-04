import { create } from 'zustand';
import { authService } from '../services/authService';

interface User {
    username: string;
    email?: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;


    // Actions
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    signUp: (username: string, password: string, email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (username: string, password: string) => {
        try {
            const result = await authService.signIn(username, password);
            console.log('✅ [AuthStore] Respuesta de signIn recibida:', result);

            const token = result.getIdToken().getJwtToken();

            set({
                user: { username },
                token,
                isAuthenticated: true,
            });
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await authService.signOut();
            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        } catch (error) {
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            const token = await authService.getToken();
            if (token) {
                set({
                    token,
                    isAuthenticated: true,
                });
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    },

    signUp: async (username: string, password: string, email: string) => {
        try {
            await authService.signUp(username, password, email);
        } catch (error) {
            throw error;
        }
    },
}));