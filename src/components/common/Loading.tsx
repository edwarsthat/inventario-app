
import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from 'react-native';
import { useUiStore } from '../../store/uiStore';

export default function Loading() {
    const { loading } = useUiStore();
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={loading}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={styles.message}>Cargando...</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        minWidth: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        textAlign: 'center',
    },
});