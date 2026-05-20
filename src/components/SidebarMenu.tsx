import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/src/store/useAuthStore';

const { width, height } = Dimensions.get('window');
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SidebarMenu = ({ visible, onClose }: SidebarMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const firstName = user?.nombre?.split(' ')[0] || 'Usuario';

  // Animaciones
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  // En lugar de ocultar de golpe (return null), dejamos el modal abierto durante la animación de salida
  // pero ya que Modal visible se controla desde el padre, este retraso visual no funciona a menos que el padre lo retrase.
  // Pero Expo Router y Modal cortan el render cuando visible pasa a false inmediatamente.
  // Lo correcto sería manejar el cierre en un estado interno, pero para simplificar dejamos return null si no está visible.
  // Wait, si hacemos return null, corta la animación de salida. Quitaré el return null si es posible,
  // O podemos modificar Modal para que use el `visible` original.

  const navigateTo = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 50);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <AnimatedBlurView
            intensity={40}
            tint="dark"
            style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

            {/* BRAND HEADER */}
            <View style={styles.brandContainer}>
              <MaterialCommunityIcons name="leaf-circle" size={34} color="#10B981" />
              <Text style={styles.brandText}>EcoScan</Text>
            </View>

            {/* PROFILE CARD */}
            <View style={styles.profileCard}>
              <View style={styles.profileBox}>
                <View style={styles.avatarContainer}>
                  <MaterialCommunityIcons name="account" size={30} color="#FFF" />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.profileName}>Hola, {firstName}</Text>
                  <Text style={styles.profilePoints}>1250 Eco Puntos</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <MaterialCommunityIcons name="chevron-left" size={26} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* RUTAS DEL MENU */}
            <View style={styles.menuItems}>

              <TouchableOpacity
                style={[styles.menuItem, isActive('/(tabs)') && styles.menuItemActive]}
                onPress={() => navigateTo('/(tabs)')}
              >
                <MaterialCommunityIcons name="home-outline" size={26} color={isActive('/(tabs)') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/(tabs)') && styles.menuTextActive]}>Inicio (Tachos)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, isActive('/dashboard') && styles.menuItemActive]}
                onPress={() => navigateTo('/dashboard')}
              >
                <MaterialCommunityIcons name="chart-box-outline" size={26} color={isActive('/dashboard') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/dashboard') && styles.menuTextActive]}>Dashboard Personal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, isActive('/canjes') && styles.menuItemActive]}
                onPress={() => navigateTo('/canjes')}
              >
                <MaterialCommunityIcons name="gift-outline" size={26} color={isActive('/canjes') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/canjes') && styles.menuTextActive]}>Recompensas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, isActive('/mis-canjes') && styles.menuItemActive]}
                onPress={() => navigateTo('/mis-canjes')}
              >
                <MaterialCommunityIcons name="ticket-percent-outline" size={26} color={isActive('/mis-canjes') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/mis-canjes') && styles.menuTextActive]}>Mis Vouchers</Text>
              </TouchableOpacity>

              {user?.rol !== 'USER' && (
                <TouchableOpacity
                  style={[styles.menuItem, isActive('/migrupo') && styles.menuItemActive]}
                  onPress={() => navigateTo('/migrupo')}
                >
                  <MaterialCommunityIcons name="account-group-outline" size={26} color={isActive('/migrupo') ? "#10B981" : "#6B7280"} />
                  <Text style={[styles.menuText, isActive('/migrupo') && styles.menuTextActive]}>Mi Grupo</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.menuItem, isActive('/dashboard-grupal') && styles.menuItemActive]}
                onPress={() => navigateTo('/dashboard-grupal')}
              >
                <MaterialCommunityIcons name="chart-box-multiple-outline" size={26} color={isActive('/dashboard-grupal') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/dashboard-grupal') && styles.menuTextActive]}>Estadísticas Grupo</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={[styles.menuItem, isActive('/perfil') && styles.menuItemActive]}
                onPress={() => navigateTo('/perfil')}
              >
                <MaterialCommunityIcons name="account-cog-outline" size={26} color={isActive('/perfil') ? "#10B981" : "#6B7280"} />
                <Text style={[styles.menuText, isActive('/perfil') && styles.menuTextActive]}>Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, isActive('/notificaciones') && styles.menuItemActive]}
                onPress={() => navigateTo('/notificaciones')}
              >
                <MaterialCommunityIcons name="bell-outline" size={26} color={isActive('/notificaciones') ? "#10B981" : "#6B7280"} />
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
                  setTimeout(() => {
                    router.replace('/(auth)/login');
                  }, 10);
                }}
              >
                <View style={styles.logoutIconBox}>
                  <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
                </View>
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
    width: width * 0.82,
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderTopRightRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 10, height: 0 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 25
  },
  safeArea: { flex: 1 },

  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 25, paddingTop: Platform.OS === 'android' ? 40 : 20, paddingBottom: 20 },
  brandText: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },

  profileCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#111827',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 24,
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8,
    marginBottom: 10
  },
  profileBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileText: { justifyContent: 'center' },
  avatarContainer: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  profilePoints: { fontSize: 13, color: '#A7F3D0', fontWeight: '600', marginTop: 2 },
  closeBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 25, marginVertical: 10 },

  menuItems: { flex: 1, paddingHorizontal: 15, marginTop: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, borderRadius: 20, marginBottom: 8, gap: 15 },
  menuItemActive: { backgroundColor: '#ECFDF5', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  menuTextActive: { color: '#065F46', fontWeight: '900', letterSpacing: 0.5 },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', marginBottom: Platform.OS === 'ios' ? 0 : 15 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 16 },
  logoutIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' }
});
