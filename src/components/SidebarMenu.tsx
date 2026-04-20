import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/useAuthStore';

const { width, height } = Dimensions.get('window');

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SidebarMenu = ({ visible, onClose }: SidebarMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  // Animación para que el menú entre desde la izquierda
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const navigateTo = (path: string) => {
    onClose();
    // Pequeño delay para que se vea bonita la animación de cierre antes de cambiar de pantalla
    setTimeout(() => {
      router.push(path as any);
    }, 250);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundDimmer} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            
            {/* HEADER DEL MENU */}
            <View style={styles.header}>
              <View style={styles.profileBox}>
                <MaterialCommunityIcons name="account-circle" size={50} color="#10B981" />
                <View style={styles.profileText}>
                  <Text style={styles.profileName}>Hola, Max 👋</Text>
                  <Text style={styles.profilePoints}>1250 Eco Puntos</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* RUTAS DEL MENU */}
            <View style={styles.menuItems}>
              
              <TouchableOpacity 
                style={[styles.menuItem, isActive('/') && styles.menuItemActive]} 
                onPress={() => navigateTo('/')}
              >
                <MaterialCommunityIcons name="home-outline" size={26} color={isActive('/') ? "#10B981" : "#4B5563"} />
                <Text style={[styles.menuText, isActive('/') && styles.menuTextActive]}>Inicio (Tachos)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, isActive('/dashboard') && styles.menuItemActive]} 
                onPress={() => navigateTo('/dashboard')}
              >
                <MaterialCommunityIcons name="chart-box-outline" size={26} color={isActive('/dashboard') ? "#10B981" : "#4B5563"} />
                <Text style={[styles.menuText, isActive('/dashboard') && styles.menuTextActive]}>Dashboard Personal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { /* Proximamente */ }}
                activeOpacity={1}
              >
                <MaterialCommunityIcons name="account-group-outline" size={26} color="#9CA3AF" />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.menuText, { color: '#9CA3AF' }]}>Dashboard Familiar</Text>
                  <View style={styles.soonBadge}>
                    <Text style={styles.soonText}>Pronto</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={[styles.menuItem, isActive('/perfil') && styles.menuItemActive]} 
                onPress={() => navigateTo('/perfil')}
              >
                <MaterialCommunityIcons name="account-cog-outline" size={26} color={isActive('/perfil') ? "#10B981" : "#4B5563"} />
                <Text style={[styles.menuText, isActive('/perfil') && styles.menuTextActive]}>Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, isActive('/notificaciones') && styles.menuItemActive]} 
                onPress={() => navigateTo('/notificaciones')}
              >
                <MaterialCommunityIcons name="bell-outline" size={26} color={isActive('/notificaciones') ? "#10B981" : "#4B5563"} />
                <Text style={[styles.menuText, isActive('/notificaciones') && styles.menuTextActive]}>Notificaciones</Text>
              </TouchableOpacity>

            </View>

            {/* FOOTER DEL MENU */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.logoutBtn}
                onPress={() => {
                  logout();
                  onClose();
                  // Esperamos a que cierre el menú para cambiar de vista sin cortes bruscos
                  setTimeout(() => {
                    router.replace('/(auth)/login');
                  }, 250);
                }}
              >
                <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backgroundDimmer: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { 
    width: width * 0.8, 
    backgroundColor: '#FFFFFF', 
    height: '100%',
    shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 15
  },
  safeArea: { flex: 1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  profileBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileText: { justifyContent: 'center' },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  profilePoints: { fontSize: 13, color: '#10B981', fontWeight: '600' },
  closeBtn: { padding: 5 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginVertical: 10 },
  
  menuItems: { flex: 1, paddingHorizontal: 15, marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15, borderRadius: 16, marginBottom: 5, gap: 15 },
  menuItemActive: { backgroundColor: '#ECFDF5' },
  menuText: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
  menuTextActive: { color: '#10B981', fontWeight: 'bold' },
  
  soonBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  soonText: { color: '#D97706', fontSize: 10, fontWeight: 'bold' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' }
});
