import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRewards, Premio } from '@/src/hooks/useRewards';
import { SidebarMenu } from '@/src/components/SidebarMenu';
import { useAuthStore } from '@/src/store/useAuthStore';

export const CanjesScreen = () => {
  const router = useRouter();
  const { premios, loading, puntos, canjearPremio } = useRewards();
  const user = useAuthStore((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Voucher State
  const [voucherVisible, setVoucherVisible] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState<{ idCanje: string, premio: Premio } | null>(null);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  const handleCanjear = (premio: Premio) => {
    Alert.alert(
      'Confirmar Canje',
      `¿Deseas canjear ${premio.costo_puntos} puntos por: ${premio.nombre_premio}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Canjear', 
          onPress: async () => {
            try {
              const idCanje = await canjearPremio(premio.id_premio);
              setCurrentVoucher({ idCanje, premio });
              setVoucherVisible(true);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo procesar el canje.');
            }
          }
        }
      ]
    );
  };

  const generateAndSharePDF = async () => {
    if (!currentVoucher) return;
    
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111827; background-color: #F3F4F6;">
          <div style="background-color: #FFFFFF; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center;">
            <h1 style="color: #10B981; margin-bottom: 5px; font-size: 32px;">EcoScan</h1>
            <h2 style="color: #6B7280; font-weight: normal; margin-top: 0;">Voucher de Canje</h2>
            
            <div style="margin: 40px 0; padding: 20px; background-color: #F9FAFB; border-radius: 12px; border: 1px dashed #D1D5DB;">
              <p style="font-size: 14px; color: #6B7280; text-transform: uppercase; margin-bottom: 5px;">Código de Retiro</p>
              <h2 style="font-size: 36px; margin: 0; color: #111827; letter-spacing: 2px;">${currentVoucher.idCanje}</h2>
            </div>
            
            <div style="text-align: left; margin-bottom: 30px;">
              <p><strong>Titular:</strong> ${user?.nombre} (${user?.email})</p>
              <p><strong>Premio:</strong> ${currentVoucher.premio.nombre_premio}</p>
              <p><strong>Puntos Utilizados:</strong> ${currentVoucher.premio.costo_puntos} Eco Puntos</p>
              <p><strong>Fecha de Canje:</strong> ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
            
            <div style="background-color: #ECFDF5; padding: 20px; border-radius: 12px; text-align: left;">
              <h3 style="color: #065F46; margin-top: 0;">Lugar de Recojo</h3>
              <p style="color: #064E3B; margin-bottom: 0;"><strong>Sede EcoScan Piura</strong><br/>Acércate con este comprobante (o tu código de retiro) para reclamar tu premio. ¡Gracias por ayudar al planeta!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf', dialogTitle: 'Compartir Voucher EcoScan' });
    } catch (err) {
      Alert.alert('Error', 'Hubo un problema al generar el documento PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={28} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSubtitle}>Tus Recompensas</Text>
            <Text style={styles.headerTitle}>Tienda EcoScan</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PUNTOS ACTUALES */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>Saldo Disponible</Text>
            <Text style={styles.pointsValue}>{puntos} <Text style={styles.pointsUnit}>Eco Puntos</Text></Text>
          </View>
          <View style={styles.pointsIconBox}>
            <MaterialCommunityIcons name="star-four-points-outline" size={36} color="#10B981" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Catálogo de Premios</Text>

        <View style={styles.catalogGrid}>
          {premios.map((premio) => {
            const canAfford = puntos >= premio.costo_puntos;
            const hasStock = premio.stock_disponible > 0;

            return (
              <View key={premio.id_premio} style={styles.rewardCard}>
                <View style={[styles.rewardIconArea, { backgroundColor: premio.color + '15' }]}>
                  <MaterialCommunityIcons name={premio.icon as any} size={42} color={premio.color} />
                  {!hasStock && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>AGOTADO</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.rewardContent}>
                  <Text style={styles.rewardName} numberOfLines={2}>{premio.nombre_premio}</Text>
                  <Text style={styles.rewardDesc} numberOfLines={3}>{premio.descripcion}</Text>
                  
                  <View style={styles.rewardMeta}>
                    <Text style={styles.rewardStock}>{premio.stock_disponible} disponibles</Text>
                    <Text style={[styles.rewardCost, !canAfford && { color: '#EF4444' }]}>
                      {premio.costo_puntos} pts
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.redeemBtn, 
                      (!canAfford || !hasStock) && styles.redeemBtnDisabled
                    ]}
                    disabled={!canAfford || !hasStock}
                    onPress={() => handleCanjear(premio)}
                  >
                    <Text style={[
                      styles.redeemBtnText,
                      (!canAfford || !hasStock) && styles.redeemBtnTextDisabled
                    ]}>
                      {!hasStock ? 'Sin Stock' : (canAfford ? 'Canjear' : 'Puntos Insuficientes')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <SidebarMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* VOUCHER MODAL */}
      <Modal visible={voucherVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.voucherCard}>
            <View style={styles.voucherHeader}>
              <MaterialCommunityIcons name="check-decagram" size={54} color="#10B981" />
              <Text style={styles.voucherTitle}>¡Canje Exitoso!</Text>
              <Text style={styles.voucherSubtitle}>Tu recompensa está lista para ser recogida.</Text>
            </View>

            <View style={styles.voucherBody}>
              <Text style={styles.voucherLabel}>Código de Retiro</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{currentVoucher?.idCanje}</Text>
              </View>

              <Text style={styles.voucherLabel}>Titular</Text>
              <Text style={[styles.voucherValue, { marginBottom: 15 }]}>{user?.nombre} ({user?.email})</Text>

              <Text style={styles.voucherLabel}>Premio</Text>
              <Text style={styles.voucherValue}>{currentVoucher?.premio.nombre_premio}</Text>

              <View style={styles.locationBox}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#065F46" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationTitle}>Lugar de Recojo</Text>
                  <Text style={styles.locationText}>Sede EcoScan Piura. Los artículos canjeados serán recogidos presentando este código o el voucher en PDF.</Text>
                </View>
              </View>
            </View>

            <View style={styles.voucherActions}>
              <TouchableOpacity style={styles.pdfBtn} onPress={generateAndSharePDF}>
                <MaterialCommunityIcons name="file-pdf-box" size={20} color="#FFF" />
                <Text style={styles.pdfBtnText}>Descargar / Compartir PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.closeBtn} onPress={() => setVoucherVisible(false)}>
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { justifyContent: 'center', alignItems: 'center' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? 15 : 10,
  },
  menuBtn: { padding: 10, backgroundColor: '#FFF', borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerSubtitle: { fontSize: 13, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  
  scrollContent: { padding: 20, paddingBottom: 40 },

  pointsCard: { backgroundColor: '#111827', borderRadius: 28, padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  pointsInfo: { flex: 1 },
  pointsLabel: { color: '#9CA3AF', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointsValue: { color: '#FFF', fontSize: 36, fontWeight: '900', marginTop: 4, letterSpacing: -1 },
  pointsUnit: { fontSize: 18, fontWeight: 'bold', color: '#10B981', letterSpacing: 0 },
  pointsIconBox: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 15, letterSpacing: -0.5 },
  
  catalogGrid: { gap: 20 },
  
  rewardCard: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  rewardIconArea: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  outOfStockBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  outOfStockText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  
  rewardContent: { padding: 20 },
  rewardName: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 6 },
  rewardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 15 },
  
  rewardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rewardStock: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  rewardCost: { fontSize: 16, fontWeight: '900', color: '#10B981' },

  redeemBtn: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 16, alignItems: 'center', shadowColor: '#111827', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  redeemBtnDisabled: { backgroundColor: '#F3F4F6', shadowOpacity: 0, elevation: 0 },
  redeemBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  redeemBtnTextDisabled: { color: '#9CA3AF' },

  // VOUCHER MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  voucherCard: { backgroundColor: '#FFF', borderRadius: 28, width: '100%', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 15 },
  voucherHeader: { backgroundColor: '#ECFDF5', padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#D1FAE5' },
  voucherTitle: { fontSize: 24, fontWeight: '900', color: '#065F46', marginTop: 10, letterSpacing: -0.5 },
  voucherSubtitle: { fontSize: 14, color: '#059669', textAlign: 'center', marginTop: 5, fontWeight: '500' },
  
  voucherBody: { padding: 30 },
  voucherLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 },
  codeBox: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  codeText: { fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: 2 },
  voucherValue: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 25 },
  
  locationBox: { flexDirection: 'row', backgroundColor: '#D1FAE5', padding: 15, borderRadius: 16, gap: 12, alignItems: 'flex-start' },
  locationTitle: { fontSize: 14, fontWeight: 'bold', color: '#065F46', marginBottom: 2 },
  locationText: { fontSize: 13, color: '#064E3B', lineHeight: 18 },

  voucherActions: { padding: 20, paddingTop: 0, gap: 10 },
  pdfBtn: { backgroundColor: '#10B981', flexDirection: 'row', padding: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8 },
  pdfBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  closeBtn: { padding: 16, alignItems: 'center' },
  closeBtnText: { color: '#6B7280', fontSize: 15, fontWeight: 'bold' }
});
