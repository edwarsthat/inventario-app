import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useRouteStore } from '../../../store/routeStore';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [scannedCode, setScannedCode] = useState<{value: string; type: string} | null>(null);
  
  const device = useCameraDevice('back');
  const { popRoute } = useRouteStore();

  // Solicitar permisos de cámara
  useEffect(() => {
    checkCameraPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCameraPermission = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    
    if (permission === 'granted') {
      setHasPermission(true);
    } else if (permission === 'not-determined') {
      const newPermission = await Camera.requestCameraPermission();
      setHasPermission(newPermission === 'granted');
    } else {
      // Permiso denegado
      Alert.alert(
        'Permiso de Cámara',
        'Necesitamos acceso a la cámara para escanear códigos de barras',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => popRoute() },
          { text: 'Abrir Configuración', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Configurar el escáner de códigos
  const codeScanner = useCodeScanner({
    codeTypes: [
      'qr',
      'ean-13',      // Códigos de barras de productos (más común)
      'ean-8',       // Códigos de barras de productos cortos
      'code-128',
      'code-39',
      'code-93',
      'codabar',
      'upc-a',       // Códigos UPC (productos en USA)
      'upc-e',       // Códigos UPC cortos
      'itf',
      'pdf-417',
      'aztec',
      'data-matrix',
    ],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isActive) {
        const code = codes[0];
        console.log(`Código escaneado: ${code.value} (${code.type})`);
        
        setScannedCode({
          value: code.value || '',
          type: code.type || '',
        });
        
        // Pausar el escaneo para evitar múltiples detecciones
        setIsActive(false);
        
        // Mostrar el resultado
        Alert.alert(
          'Código Detectado',
          `Tipo: ${code.type}\nValor: ${code.value}`,
          [
            {
              text: 'Escanear otro',
              onPress: () => {
                setIsActive(true);
                setScannedCode(null);
              },
            },
            {
              text: 'Cerrar',
              onPress: () => popRoute(),
            },
          ]
        );
      }
    },
  });

  const resetScanner = () => {
    setIsActive(true);
    setScannedCode(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos permiso para acceder a la cámara
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={checkCameraPermission}
        >
          <Text style={styles.buttonText}>Solicitar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando cámara...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      
      {/* Overlay con área de escaneo */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Escanear Código</Text>
          <Text style={styles.subtitle}>
            Centra el código dentro del marco
          </Text>
        </View>

        {/* Marco de escaneo */}
        <View style={styles.scanArea}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Información del código escaneado */}
        {scannedCode && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Último código:</Text>
            <Text style={styles.resultType}>{scannedCode.type}</Text>
            <Text style={styles.resultValue} numberOfLines={2}>
              {scannedCode.value}
            </Text>
          </View>
        )}

        {/* Botones */}
        <View style={styles.buttonContainer}>
          {!isActive && (
            <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
              <Text style={styles.resetButtonText}>Escanear Nuevo Código</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => popRoute()}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  scanArea: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00FF00',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  resultType: {
    color: '#00FF00',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
