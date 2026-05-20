import { useState, useEffect } from 'react';

export interface Metricas {
  huella_carbono_ahorrada: number;
  racha_dias_activos: number;
  eco_puntos_personales: number;
  cantidad_plastico: number;
  cantidad_papel: number;
  cantidad_vidrio: number;
}

export interface HistorialItem {
  id_registro: number;
  tipo_residuo: 'Plastico' | 'Papel' | 'Vidrio';
  cantidad: number;
  puntos_ganados: number;
  fecha_escaneo: string;
  iso_date: string;
}

import { usePointsStore } from '@/src/store/usePointsStore';
import api from '@/src/services/api';

export const useDashboard = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const globalPoints = usePointsStore((state) => state.puntos);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/dashboard');
      setMetricas(response.data.metricas);
      setHistorial(response.data.historial);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Opcional: manejar estado de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Override eco_puntos con el global si ya cargaron las métricas
  // Esto mantiene sincronizado el header y el dashboard
  const metricasSync = metricas ? { ...metricas, eco_puntos_personales: globalPoints } : null;

  return { 
    metricas: metricasSync, 
    historial, 
    loading,
    refreshDashboard: fetchDashboardData // Exportamos por si necesitamos refrescar manualmente
  };
};
