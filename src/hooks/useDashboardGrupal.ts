import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export type FiltroTiempo = 'SEMANA' | 'MES' | 'AÑO';

export interface Recomendacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'POSITIVO' | 'MEJORA' | 'ALERTA';
}

export const useDashboardGrupal = () => {
  const [filtro, setFiltro] = useState<FiltroTiempo>('SEMANA');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    puntos_totales: 0,
    co2_ahorrado: 0,
    materiales: { plastico: 0, papel: 0, vidrio: 0 },
    aporte_miembros: [] as any[],
    recomendaciones: [] as Recomendacion[]
  });

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Obtener la lista de grupos del usuario
      const gruposRes = await api.get('/v1/grupos');
      const grupos = gruposRes.data.data;

      if (!grupos || grupos.length === 0) {
        setLoading(false);
        return; // No pertenece a ningún grupo
      }

      const idGrupo = grupos[0].id_grupo;

      // 2. Obtener los detalles del grupo y el ranking
      const detalleRes = await api.get(`/v1/grupos/${idGrupo}`);
      const detalleData = detalleRes.data.data;

      // Mapear el ranking para la gráfica (react-native-gifted-charts)
      const chartData = (detalleData.ranking || []).map((miembro: any, index: number) => ({
        value: miembro.puntos_aportados || 0,
        label: miembro.nombre.split(' ')[0], // Solo el primer nombre
        frontColor: colors[index % colors.length]
      }));

      // 3. (Opcional) Las estadísticas de materiales y recomendaciones se pueden simular
      // o calcular en un futuro desde el backend. Por ahora usamos los reales para puntos.
      setData({
        puntos_totales: detalleData.puntos_totales || 0,
        co2_ahorrado: ((detalleData.puntos_totales || 0) * 0.05).toFixed(1) as any, // Simulación: 0.05kg por punto
        materiales: { plastico: 15, papel: 10, vidrio: 5 }, // Hardcoded temporal
        aporte_miembros: chartData,
        recomendaciones: [
          { id: '1', titulo: '¡Sigan así!', mensaje: 'El reciclaje familiar está sumando puntos.', tipo: 'POSITIVO' },
        ]
      });

    } catch (error) {
      console.error('Error fetching dashboard grupal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filtro]);

  return { filtro, setFiltro, data, loading, refresh: fetchDashboardData };
};
