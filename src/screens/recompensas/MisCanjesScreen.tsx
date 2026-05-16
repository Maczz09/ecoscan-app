import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useMisCanjes, CanjeRealizado } from '@/src/hooks/useMisCanjes';
import { useAuthStore } from '@/src/store/useAuthStore';

export const MisCanjesScreen = () => {
  const router = useRouter();
  const { misCanjes, loading } = useMisCanjes();
  const user = useAuthStore((state) => state.user);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  const generateAndSharePDF = async (canje: CanjeRealizado) => {
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
              <h2 style="font-size: 36px; margin: 0; color: #111827; letter-spacing: 2px;">${canje.id_canje}</h2>
            </div>
            
            <div style="text-align: left; margin-bottom: 30px;">
              <p><strong>Titular:</strong> ${user?.nombre} (${user?.email})</p>
              <p><strong>Premio:</strong> ${canje.premio.nombre_premio}</p>
              <p><strong>Puntos Utilizados:</strong> ${canje.premio.costo_puntos} Eco Puntos</p>
              <p><strong>Fecha de Canje:</strong> ${new Date(canje.fecha_canje).toLocaleDateString('es-ES')} - ${new Date(canje.fecha_canje).toLocaleTimeString('es-ES')}</p>
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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Vouchers</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {misCanjes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Sin canjes aún</Text>
            <Text style={styles.emptyText}>Visita la tienda de recompensas y utiliza tus Eco Puntos para obtener increíbles premios.</Text>
          </View>
        ) : (
          misCanjes.map((canje) => (
            <View key={canje.id_canje} style={styles.voucherCard}>
              <View style={[styles.voucherIconBox, { backgroundColor: canje.premio.color + '15' }]}>
                <MaterialCommunityIcons name={canje.premio.icon as any} size={32} color={canje.premio.color} />
              </View>
              
              <View style={styles.voucherDetails}>
                <Text style={styles.voucherDate}>{new Date(canje.fecha_canje).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                <Text style={styles.voucherName} numberOfLines={2}>{canje.premio.nombre_premio}</Text>
                <Text style={styles.voucherCode}>ID: {canje.id_canje}</Text>
              </View>

              <TouchableOpacity style={styles.downloadBtn} onPress={() => generateAndSharePDF(canje)}>
                <MaterialCommunityIcons name="file-pdf-box" size={28} color="#10B981" />
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>
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
    paddingVertical: Platform.OS === 'android' ? 15 : 10,
    backgroundColor: '#F3F4F6',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
  
  scrollContent: { padding: 20, paddingBottom: 40 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginTop: 15, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },

  voucherCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  voucherIconBox: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  voucherDetails: { flex: 1 },
  voucherDate: { fontSize: 12, color: '#9CA3AF', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  voucherName: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 6 },
  voucherCode: { fontSize: 13, color: '#6B7280', fontWeight: '600', backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  
  downloadBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }
});
