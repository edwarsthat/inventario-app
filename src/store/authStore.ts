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
    requirePasswordChange: boolean;
    tempCognitoUser: any | null;

    // Actions
    login: (username: string, password: string) => Promise<void>;
    completePasswordChange: (newPassword: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    signUp: (username: string, password: string, email: string) => Promise<void>;
}


export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    requirePasswordChange: false,
    tempCognitoUser: null,

    login: async (username: string, password: string) => {
        try {
            const result = await authService.signIn(username, password);
            console.log('✅ [AuthStore] Respuesta de signIn recibida:', result);

            const token = result.getIdToken().getJwtToken();
            const payload = result.getIdToken().payload;

            // Extraer información del usuario del token
            const userInfo = {
                username: payload['cognito:username'] || username,
                email: payload.email,
                name: payload.name,
                grupos: payload['cognito:groups'] || [],
            };

            set({
                user: userInfo,
                token,
                isAuthenticated: true,
                requirePasswordChange: false,
                tempCognitoUser: null,
            });
        } catch (error: any) {
            // Verificar si requiere cambio de contraseña
            if (error.code === 'NewPasswordRequired') {
                console.log('🔒 [AuthStore] Se requiere cambio de contraseña');
                set({
                    requirePasswordChange: true,
                    tempCognitoUser: error.cognitoUser,
                    user: { username },
                });
                throw error; // Propagar el error para manejarlo en el componente
            }
            throw error;
        }
    },

    completePasswordChange: async (newPassword: string) => {
        try {
            const { tempCognitoUser } = get();

            if (!tempCognitoUser) {
                throw new Error('No hay usuario temporal para cambiar contraseña');
            }

            const result = await authService.completeNewPasswordChallenge(
                tempCognitoUser,
                newPassword,
                {}
            );

            const token = result.getIdToken().getJwtToken();

            set({
                token,
                isAuthenticated: true,
                requirePasswordChange: false,
                tempCognitoUser: null,
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
    }
}));