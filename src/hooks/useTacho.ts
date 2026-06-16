import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import api from '@/src/services/api';
import { usePointsStore } from '@/src/store/usePointsStore';

export interface DashboardData {
  tacho: {
    codigo_qr: string;
    estado_operativo: string;
    nivel_llenado_plastico: number;
    nivel_llenado_papel: number;
    nivel_llenado_organico: number;
    nivel_llenado_vidrio: number;
    ultima_conexion: string;
  } | null;
  metricas: {
    eco_puntos_personales: number; 
    racha_dias_activos: number;    
  };
  sesion_actual: Array<{
    material: string;
    puntos: number;
    hora: string;
  }>;
}

export const useTacho = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const setGlobalPoints = usePointsStore(state => state.setPuntos);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTachoStatus = useCallback(async (isBackground = false) => {
    try {
      // Solo mostramos la pantalla de carga completa si no es una carga de fondo
      if (!isBackground) setIsLoading(true);
      
      const response = await api.get('/v1/tacho/status');
      
      if (response.data.status === 'success') {
        const tachoData = response.data.data;
        setData(tachoData);
        
        if (tachoData.metricas?.eco_puntos_personales !== undefined) {
          setGlobalPoints(tachoData.metricas.eco_puntos_personales);
        }
      }
    } catch (error) {
      console.error('Error fetching tacho status:', error);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [setGlobalPoints]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchTachoStatus(true);
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      // 1. Carga inicial al enfocar la pantalla
      fetchTachoStatus(true); // background=true para no parpadear la pantalla

      // 2. Polling cada 3 segundos
      const interval = setInterval(() => {
        if (isActive) {
          fetchTachoStatus(true);
        }
      }, 3000);

      // Limpiamos el intervalo si el usuario cambia de pestaña
      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [fetchTachoStatus])
  );
  
  return { data, isLoading, isRefreshing, onRefresh, refetch: fetchTachoStatus };
};

