import { useState, useEffect, useCallback } from 'react';
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
}

export const useTacho = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const setGlobalPoints = usePointsStore(state => state.setPuntos);

  const fetchTachoStatus = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [setGlobalPoints]);

  useEffect(() => {
    fetchTachoStatus();
  }, [fetchTachoStatus]);

  return { data, isLoading, refetch: fetchTachoStatus };
};

