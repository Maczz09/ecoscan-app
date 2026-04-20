import { useState, useEffect } from 'react';
import { Notification } from '@/src/types/database';

// Mock data based on the database schema
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id_notificacion: 1,
    id_usuario: 1,
    titulo: '¡Meta Alcanzada!',
    mensaje: 'Has alcanzado los 500 EcoPuntos semanales. ¡Sigue así!',
    tipo: 'META_ALCANZADA',
    leida: false,
    fecha_creacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id_notificacion: 2,
    id_usuario: 1,
    titulo: 'Recordatorio de reciclaje',
    mensaje: 'Tu tacho de plástico está al 80% de su capacidad.',
    tipo: 'RECORDATORIO',
    leida: false,
    fecha_creacion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id_notificacion: 3,
    id_usuario: 1,
    titulo: 'Mantenimiento programado',
    mensaje: 'El sistema estará en mantenimiento esta noche a las 2 AM.',
    tipo: 'ALERTA_SISTEMA',
    leida: true,
    fecha_creacion: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id_notificacion: 4,
    id_usuario: 1,
    titulo: 'Nuevo premio disponible',
    mensaje: 'Se ha añadido un nuevo termo ecológico a la tienda de premios.',
    tipo: 'ALERTA_SISTEMA',
    leida: true,
    fecha_creacion: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];

export const useNotificaciones = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Simular llamada al backend
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        setLoading(true);
        // Simulamos delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        setNotifications(MOCK_NOTIFICATIONS);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificaciones();
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id_notificacion === id ? { ...notif, leida: true } : notif
      )
    );
    // Aquí iría la llamada al backend: PUT /api/notificaciones/:id/leer
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, leida: true })));
    // Aquí iría la llamada al backend: PUT /api/notificaciones/leer-todas
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};
