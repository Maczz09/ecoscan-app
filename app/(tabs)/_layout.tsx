import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Sin texto
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <MaterialCommunityIcons 
                name={focused ? "home" : "home-outline"} 
                size={32} /* Más grande */
                color={focused ? "#10B981" : "#9CA3AF"} /* Color explícito */
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconActive]}>
              <MaterialCommunityIcons 
                name={focused ? "chart-bar" : "chart-box-outline"} 
                size={32} /* Más grande */
                color={focused ? "#10B981" : "#9CA3AF"} /* Color explícito */
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20, // La subimos un poco en iOS
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 75, // Un poco más alta
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Sombra más marcada para que resalte del fondo
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 0,
    paddingBottom: 0, // Evita que Expo empuje los iconos hacia arriba
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 55,
    borderRadius: 20,
    // En iOS, como quitamos el texto, hay que centrar verticalmente el icono
    marginTop: Platform.OS === 'ios' ? 15 : 0, 
  },
  iconActive: {
    backgroundColor: '#ECFDF5', // Verde clarito de fondo
  }
});