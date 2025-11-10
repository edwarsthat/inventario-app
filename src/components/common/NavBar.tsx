import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function NavBar() {
    const { user } = useAuthStore();
    
    // Obtener el nombre a mostrar (username o email)
    const displayName = user?.name || user?.username || user?.email || 'Usuario';
    // Obtener la inicial para el avatar
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                {/* Logo/Título */}
                <View style={styles.leftSection}>
                    <Text style={styles.logo}>📦</Text>
                    <Text style={styles.appName}>Hola, {displayName}</Text>
                </View>

                {/* Sección derecha con iconos */}
                <View style={styles.rightSection}>
                    {/* Menú de usuario */}
                    <TouchableOpacity style={styles.userButton}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{avatarInitial}</Text>
                        </View>
                        <Text style={styles.icon}>▼</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c3e50',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    navbar: {
        height: 60,
        backgroundColor: '#2c3e50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        marginRight: 8,
    },
    appName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconButton: {
        padding: 8,
        position: 'relative',
    },
    icon: {
        fontSize: 20,
        color: '#fff',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    username: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
}); 