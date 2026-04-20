import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotificaciones } from '@/src/hooks/useNotificaciones';
import { Notification } from '@/src/types/database';

export const NotificacionesScreen = () => {
  const router = useRouter();
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotificaciones();

  const getIconData = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'META_ALCANZADA':
        return { name: 'trophy', color: '#F59E0B', bg: '#FEF3C7' };
      case 'RECORDATORIO':
        return { name: 'calendar-clock', color: '#3B82F6', bg: '#DBEAFE' };
      case 'ALERTA_SISTEMA':
        return { name: 'alert-circle', color: '#EF4444', bg: '#FEE2E2' };
      default:
        return { name: 'bell', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const iconData = getIconData(item.tipo);
    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !item.leida && styles.unreadCard]}
        onPress={() => markAsRead(item.id_notificacion)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
          <MaterialCommunityIcons name={iconData.name as any} size={24} color={iconData.color} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.leida && styles.unreadText]} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={styles.timeText}>{formatDate(item.fecha_creacion)}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.mensaje}</Text>
        </View>
        {!item.leida && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Personalizado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Leer todo</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Lista de Notificaciones */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="bell-sleep" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No tienes notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id_notificacion.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  markAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    color: '#111827',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginLeft: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  }
});
