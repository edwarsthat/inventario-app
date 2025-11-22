import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useUiStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { useRouteStore } from '../../../store/routeStore';

const LoginScreen: React.FC = ({ }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { loading, setLoading } = useUiStore();
    const { login } = useAuthStore();
    const pushRoute = useRouteStore(state => state.pushRoute);

    const handleLogin = async () => {
        try {
            setLoading(true);
            // Resetear errores
            setUsernameError('');
            setPasswordError('');

            // Validar campos
            let hasError = false;
            if (!username.trim()) {
                setUsernameError('Por favor ingresa tu usuario');
                hasError = true;
            }
            if (!password.trim()) {
                setPasswordError('Por favor ingresa tu contraseña');
                hasError = true;
            }

            if (hasError) {
                return;
            }

            console.log('Attempting login with:', { username, password });
            await login(username, password);
            // La navegación se manejará automáticamente por el estado
        } catch (error: any) {
            // Verificar si requiere cambio de contraseña
            if (error.code === 'NewPasswordRequired') {
                console.log('🔒 Redirigiendo a cambio de contraseña...');
                pushRoute('Auth/ResetPassword');
                return;
            }
            setPasswordError(error.message.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.loginContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>InventoryApp</Text>
                    <Text style={styles.subtitle}>Gestiona tu inventario</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Usuario</Text>
                        <TextInput
                            style={[styles.input, usernameError && styles.inputError]}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (usernameError) setUsernameError('');
                            }}
                            placeholder="Ingresa tu usuario"
                            placeholderTextColor="#999"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {usernameError ? (
                            <Text style={styles.errorText}>{usernameError}</Text>
                        ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={[styles.input, passwordError && styles.inputError]}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError) setPasswordError('');
                            }}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#999"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {passwordError ? (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        ) : null}
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.loginButtonText}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        ¿Olvidaste tu contraseña?
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Recuperar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loginContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    inputError: {
        borderColor: '#e74c3c',
        borderWidth: 1.5,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    loginButton: {
        backgroundColor: '#3498db',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#3498db',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    loginButtonDisabled: {
        backgroundColor: '#bdc3c7',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footerContainer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
    },
    linkText: {
        fontSize: 14,
        color: '#3498db',
        fontWeight: '600',
    },
});

export default LoginScreen;