import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const CrearTachoScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  // Modal PIN
  const [pinVisible, setPinVisible] = useState(false);
  const [tachoId, setTachoId] = useState('');
  const [pin, setPin] = useState('');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#9CA3AF" />
        <Text style={styles.permissionText}>Necesitamos permiso para usar tu cámara y escanear el QR del tacho físico.</Text>
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
    setTachoId(data);
    setPinVisible(true);
  };

  const handleVincularAlGrupo = () => {
    if (pin.length !== 6) {
      Alert.alert('Error', 'El PIN debe tener 6 dígitos.');
      return;
    }

    if (pin === '123456') {
      setPinVisible(false);
      Alert.alert(
        '¡Tacho Añadido al Grupo!',
        `El contenedor ${tachoId} se ha registrado y vinculado a tu grupo exitosamente.`,
        [{ text: 'Excelente', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('PIN Incorrecto', 'El PIN ingresado no coincide con el del fabricante.');
      setPin('');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Tacho en Grupo</Text>
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
            <Text style={styles.instructionText}>Apunta la cámara al código QR del Tacho Físico para añadirlo a tu Grupo</Text>
          </View>
        </CameraView>
      </View>

      {/* MODAL PIN */}
      <Modal visible={pinVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialCommunityIcons name="shield-check" size={48} color="#10B981" />
            <Text style={styles.modalTitle}>Hardware Detectado</Text>
            <Text style={styles.modalSubtitle}>Código: {tachoId}</Text>
            
            <Text style={styles.pinLabel}>Ingresa el PIN de seguridad del fabricante (6 dígitos)</Text>
            <TextInput
              style={styles.pinInput}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              value={pin}
              onChangeText={setPin}
              placeholder="••••••"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => { setPinVisible(false); setScanned(false); setPin(''); }}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={handleVincularAlGrupo}>
                <Text style={styles.btnConfirmText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginTop: 10 },
  modalSubtitle: { fontSize: 15, color: '#6B7280', fontWeight: '500', marginBottom: 25 },
  
  pinLabel: { fontSize: 14, color: '#111827', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 8 },
  pinInput: { width: '100%', backgroundColor: '#F3F4F6', borderRadius: 16, padding: 20, fontSize: 24, fontWeight: 'bold', letterSpacing: 8, textAlign: 'center', color: '#111827', marginBottom: 30 },
  
  modalActions: { flexDirection: 'row', gap: 15 },
  btnCancel: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnCancelText: { color: '#6B7280', fontSize: 16, fontWeight: 'bold' },
  btnConfirm: { flex: 1, backgroundColor: '#111827', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnConfirmText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
