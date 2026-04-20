import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* La barra va FUERA del wrapper absoluto para no bloquear toques */}
      <View style={styles.wrapper}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            if (['+not-found'].includes(route.name)) return null;

            const isFocused = state.index === index;

            const onPress = () => {
              if (route.name === 'dashboard') {
                setShowMenu(true);
                return;
              }

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName = 'home-outline';
            if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
            if (route.name === 'dashboard') iconName = isFocused ? 'chart-bar' : 'chart-box-outline';

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tabItem}
                // ✅ FIX: asegurar que los toques no se bloqueen
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={[styles.iconContainer, isFocused && styles.iconActive]}>
                  <MaterialCommunityIcons
                    name={iconName as any}
                    size={32}
                    color={isFocused ? '#10B981' : '#9CA3AF'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Modal fuera del wrapper para evitar conflictos de z-index */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          {/* ✅ FIX: TouchableWithoutFeedback necesita un solo hijo directo */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />

              <Text style={styles.sheetTitle}>Elige tu Dashboard</Text>
              <Text style={styles.sheetSubtitle}>¿Qué estadísticas deseas visualizar hoy?</Text>

              <TouchableOpacity
                style={styles.optionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setShowMenu(false);
                  router.push('/dashboard');
                }}
              >
                <View style={[styles.optionIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialCommunityIcons name="account" size={28} color="#10B981" />
                </View>
                <View style={styles.optionTexts}>
                  <Text style={styles.optionTitle}>Dashboard Personal</Text>
                  <Text style={styles.optionDesc}>Tu impacto individual y ecopuntos</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D5DB" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setShowMenu(false);
                  // navigation.navigate('dashboard-familiar');
                }}
              >
                <View style={[styles.optionIconBox, { backgroundColor: '#F3F4F6' }]}>
                  <MaterialCommunityIcons name="account-group" size={28} color="#6B7280" />
                </View>
                <View style={styles.optionTexts}>
                  <Text style={[styles.optionTitle, { color: '#6B7280' }]}>Dashboard Familiar</Text>
                  <Text style={styles.optionDesc}>Estadísticas conjuntas (Próximamente)</Text>
                </View>
                <View style={styles.badgeSoon}>
                  <Text style={styles.badgeSoonText}>Pronto</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // ✅ FIX: eliminado pointerEvents="box-none" del wrapper
  // ✅ FIX: altura automática según contenido, no fija en 100px
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // ✅ FIX: paddingBottom correcto para safe area sin cortar toques
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingHorizontal: 20,
    // ✅ FIX: sin backgroundColor para que el contenido detrás sea visible
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 70,
    // ✅ FIX: elevation alta para que esté por encima del contenido
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // ✅ FIX: altura completa para área táctil correcta
    height: '100%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    width: 52,
    borderRadius: 18,
  },
  iconActive: {
    backgroundColor: '#ECFDF5',
  },

  // MODAL / BOTTOM SHEET
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    // ✅ FIX: sombra hacia arriba
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  sheetHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 25,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  optionIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTexts: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  badgeSoon: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSoonText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: 'bold',
  },
});