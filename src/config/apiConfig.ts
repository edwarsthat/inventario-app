import { Platform } from 'react-native';


const getApiUrl = () => {
    if (__DEV__) {
        // DESARROLLO
        if (Platform.OS === 'android') {
             return 'http://10.0.2.2:8080';
            // return 'http://192.168.1.100:8080';

        }

        // Para simulador de iOS
        return 'http://localhost:8080';
    }

    // PRODUCCIÓN
    return 'https://tu-api-produccion.com';
};

export const API_BASE_URL = getApiUrl();

// Endpoints específicos (opcional pero recomendado)
export const API_ENDPOINTS = {
    LOGIN: '/api/auth/login',
};

// Log de configuración en desarrollo
if (__DEV__) {
    console.log('🌐 [API Config] Base URL:', API_BASE_URL);
    console.log('📱 [API Config] Platform:', Platform.OS);
}