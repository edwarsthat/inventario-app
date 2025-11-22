import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouteStore } from '../../../store/routeStore';

export default function ChangePass() {
    const { pushRoute, clearStack } = useRouteStore();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleChangePassword = async () => {
        // Resetear errores
        setNewPasswordError('');
        setConfirmPasswordError('');

        // Validar campos
        let hasError = false;
        
        if (!newPassword.trim()) {
            setNewPasswordError('Por favor ingresa tu nueva contraseña');
            hasError = true;
        }
        
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Por favor confirma tu nueva contraseña');
            hasError = true;
        }

        // Validar que las contraseñas coincidan
        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            setConfirmPasswordError('Las contraseñas no coinciden');
            hasError = true;
        }

        // Validar longitud mínima de contraseña
        if (newPassword && newPassword.length < 8) {
            setNewPasswordError('La contraseña debe tener al menos 8 caracteres');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        console.log('Cambiando contraseña...');
        try {
            Alert.alert('Éxito', 'Contraseña cambiada correctamente');
            // Navegar a Home después del cambio exitoso
            clearStack();
            pushRoute('Home');
        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error);
            setNewPasswordError(error.message || 'Error al cambiar la contraseña');
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.changePassContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Cambiar Contraseña</Text>
                        <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nueva Contraseña</Text>
                            <TextInput
                                style={[styles.input, newPasswordError && styles.inputError]}
                                placeholder="Ingresa tu nueva contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={newPassword}
                                onChangeText={(text) => {
                                    setNewPassword(text);
                                    if (newPasswordError) setNewPasswordError('');
                                }}
                            />
                            {newPasswordError ? (
                                <Text style={styles.errorText}>{newPasswordError}</Text>
                            ) : null}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
                            <TextInput
                                style={[styles.input, confirmPasswordError && styles.inputError]}
                                placeholder="Confirma tu nueva contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (confirmPasswordError) setConfirmPasswordError('');
                                }}
                            />
                            {confirmPasswordError ? (
                                <Text style={styles.errorText}>{confirmPasswordError}</Text>
                            ) : null}
                        </View>

                        <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
                            <Text style={styles.changeButtonText}>
                                Cambiar Contraseña
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => pushRoute('Auth/Login')}>
                            <Text style={styles.cancelButtonText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        flexGrow: 1,
    },
    changePassContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 20,
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
    changeButton: {
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
    changeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#e74c3c',
    },
    cancelButtonText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '600',
    },
});