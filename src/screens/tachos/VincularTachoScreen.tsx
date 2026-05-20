import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const VincularTachoScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#9CA3AF" />
        <Text style={styles.permissionText}>Necesitamos permiso para usar tu cámara y escanear el QR del tacho para reciclar.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Otorgar Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
          <Text style={styles.btnSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    
    // Simulate successful linkage for recycling
    Alert.alert(
      '¡Conectado exitosamente!',
      `Te has vinculado al tacho: ${data}. \n\nDeposita tus residuos ahora para ganar Eco Puntos.`,
      [{ text: '¡A Reciclar!', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanea para Reciclar</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.instructionText}>Apunta la cámara al código QR del Tacho EcoScan para iniciar tu sesión de reciclaje</Text>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#000' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },

  permissionText: { color: '#FFF', textAlign: 'center', marginVertical: 20, fontSize: 16, lineHeight: 24 },
  btnPrimary: { backgroundColor: '#10B981', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 16, marginBottom: 15 },
  btnPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnSecondary: { paddingVertical: 15 },
  btnSecondaryText: { color: '#9CA3AF', fontSize: 16, fontWeight: 'bold' },

  cameraContainer: { flex: 1, borderRadius: 30, overflow: 'hidden', margin: 10, backgroundColor: '#1F2937' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { width: 250, height: 250, borderWidth: 2, borderColor: '#10B981', borderRadius: 20, backgroundColor: 'transparent' },
  instructionText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginTop: 30, textAlign: 'center', paddingHorizontal: 40 },
});
