import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { awsConfig } from '../config/awsConfig';
import * as Keychain from 'react-native-keychain';

const userPool = new CognitoUserPool({
    UserPoolId: awsConfig.userPoolId,
    ClientId: awsConfig.userPoolWebClientId,
});

export const authService = {
    // LOGIN
    signIn: (username: string, password: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const authenticationDetails = new AuthenticationDetails({
                Username: username,
                Password: password,
            });

            const cognitoUser = new CognitoUser({
                Username: username,
                Pool: userPool,
            });

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async (result) => {
                    console.log('🎉 LOGIN EXITOSO - Respuesta completa del servidor:', JSON.stringify(result, null, 2));
                    console.log('📋 Detalles del token:', {
                        accessToken: result.getAccessToken().getJwtToken(),
                        idToken: result.getIdToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken(),
                    });
                    const token = result.getIdToken().getJwtToken();
                    await Keychain.setGenericPassword(username, token);
                    resolve(result);
                },
                onFailure: (err) => {
                    console.log('❌ ERROR EN LOGIN - Respuesta del servidor:', JSON.stringify(err, null, 2));
                    console.log('📝 Detalles del error:', {
                        code: err.code,
                        name: err.name,
                        message: err.message,
                    });
                    reject(err);
                },
            });
        });
    },
    // REGISTRO
    signUp: (username: string, password: string, email: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const attributeList = [
                new CognitoUserAttribute({
                    Name: 'email',
                    Value: email,
                }),
            ];

            userPool.signUp(username, password, attributeList, [], (err, result) => {
                if (err) {
                    console.log('❌ ERROR EN REGISTRO - Respuesta del servidor:', JSON.stringify(err, null, 2));
                    console.log('📝 Detalles del error de registro:', {
                        code: (err as any).code,
                        name: err.name,
                        message: err.message,
                    });
                    reject(err);
                    return;
                }
                console.log('✅ REGISTRO EXITOSO - Respuesta del servidor:', JSON.stringify(result, null, 2));
                console.log('📋 Detalles del registro:', {
                    user: result?.user?.getUsername(),
                    userSub: result?.userSub,
                    codeDeliveryDetails: result?.codeDeliveryDetails,
                });
                resolve(result);
            });
        });
    },
    // CONFIRMAR CÓDIGO
    confirmSignUp: (username: string, code: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const cognitoUser = new CognitoUser({
                Username: username,
                Pool: userPool,
            });

            cognitoUser.confirmRegistration(code, true, (err, result) => {
                if (err) {
                    console.log('❌ ERROR EN CONFIRMACIÓN - Respuesta del servidor:', JSON.stringify(err, null, 2));
                    console.log('📝 Detalles del error de confirmación:', {
                        code: (err as any).code,
                        name: err.name,
                        message: err.message,
                    });
                    reject(err);
                    return;
                }
                console.log('✅ CONFIRMACIÓN EXITOSA - Respuesta del servidor:', JSON.stringify(result, null, 2));
                console.log('📋 Usuario confirmado exitosamente');
                resolve(result);
            });
        });
    },
    // LOGOUT
    signOut: async (): Promise<void> => {
        console.log('🚪 Iniciando proceso de logout...');
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            console.log('👤 Usuario encontrado, cerrando sesión de Cognito...');
            cognitoUser.signOut();
        } else {
            console.log('⚠️ No hay usuario activo en Cognito');
        }
        await AsyncStorage.removeItem('userToken');
        console.log('✅ Token removido del almacenamiento local');
        console.log('🎯 Logout completado');
    },
    // OBTENER TOKEN
    getToken: async (): Promise<string | null> => {
        const token = await AsyncStorage.getItem('userToken');
        console.log('🔍 Verificando token almacenado:', token ? 'Token encontrado' : 'No hay token');
        return token;
    },
};