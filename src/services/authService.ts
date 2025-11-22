
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';



export const authService = {
    login: async (username: string, password: string) => {
        try {
            const url = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;
            console.log('🌐 =====================');
            console.log('🌐 [AuthService] URL completa:', url);
            console.log('🌐 [AuthService] API_BASE_URL:', API_BASE_URL);
            console.log('🌐 [AuthService] API_ENDPOINTS.LOGIN:', API_ENDPOINTS.LOGIN);
            console.log('📤 [AuthService] Usuario:', username);
            console.log('🌐 =====================');
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                console.log('⏱️ [AuthService] TIMEOUT - La petición tardó más de 10 segundos');
                controller.abort();
            }, 10000);
            
            console.log('📡 [AuthService] Enviando petición...');
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            
            console.log('📥 [AuthService] Respuesta recibida!');
            console.log('📥 [AuthService] Status:', response.status);
            console.log('📥 [AuthService] Status text:', response.statusText);
            console.log('📥 [AuthService] OK:', response.ok);

            if (!response.ok) {
                const error = await response.text();
                console.error('❌ [AuthService] Error del servidor:', error);
                throw new Error(error || 'Error en login');
            }

            const data = await response.json();
            console.log('✅ [AuthService] Login exitoso:', data);
            await AsyncStorage.setItem('authToken', data.token);
            await Keychain.setGenericPassword(username, data.token);
            return data;
        } catch (error: any) {
            console.error('💥 =====================');
            console.error('💥 [AuthService] ERROR CAPTURADO');
            console.error('💥 [AuthService] Tipo de error:', error.name);
            console.error('💥 [AuthService] Mensaje:', error.message);
            console.error('💥 [AuthService] Stack:', error.stack);
            console.error('💥 =====================');
            
            if (error.name === 'AbortError') {
                throw new Error('⏱️ Tiempo de espera agotado. Verifica tu conexión y que el servidor esté corriendo.');
            }
            throw error;
        }
    },
    checkAuth: async () => {
        try {
            console.log('🔍 [AuthService] Verificando autenticación...');
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log('✅ [AuthService] Credenciales encontradas');
                return true;
            } else {
                console.log('❌ [AuthService] No hay credenciales');
                return false;
            }
        } catch (error) {
            console.error('💥 [AuthService] Error en checkAuth:', error);
            throw error;
        }
    }

};