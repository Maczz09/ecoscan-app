import { useState, useEffect } from 'react';
import { usePointsStore } from '../store/usePointsStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

export interface Premio {
  id_premio: number;
  nombre_premio: string;
  descripcion: string;
  costo_puntos: number;
  stock_disponible: number;
  icon: string;
  color: string;
}

const MOCK_PREMIOS: Premio[] = [
  { id_premio: 1, nombre_premio: 'Bolsa Ecológica Tela', descripcion: 'Bolsa reutilizable de algodón orgánico con el logo de EcoScan.', costo_puntos: 500, stock_disponible: 50, icon: 'shopping', color: '#10B981' },
  { id_premio: 2, nombre_premio: 'Termo Metálico 500ml', descripcion: 'Mantiene bebidas frías o calientes, evita botellas de plástico.', costo_puntos: 1200, stock_disponible: 15, icon: 'cup-water', color: '#3B82F6' },
  { id_premio: 3, nombre_premio: 'Cupón 20% Supermercado', descripcion: 'Descuento aplicable en sección de productos orgánicos.', costo_puntos: 800, stock_disponible: 100, icon: 'ticket-percent', color: '#F59E0B' },
  { id_premio: 4, nombre_premio: 'Set Cubiertos Bambú', descripcion: 'Ideal para comer fuera sin usar plásticos desechables.', costo_puntos: 600, stock_disponible: 30, icon: 'silverware-fork-knife', color: '#8B5CF6' },
  { id_premio: 5, nombre_premio: 'Pase Transporte', descripcion: 'Pase de viajes en red de metro/autobús local.', costo_puntos: 2500, stock_disponible: 5, icon: 'bus', color: '#EF4444' }
];

export const useRewards = () => {
  const [premios, setPremios] = useState<Premio[]>([]);
  const [loading, setLoading] = useState(true);
  const { puntos, subtractPuntos } = usePointsStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchPremios();
  }, []);

  const fetchPremios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/recompensas');

      const iconMap: Record<string, { icon: string, color: string }> = {
        'comida': { icon: 'food', color: '#F59E0B' },
        'merchandising': { icon: 'shopping', color: '#8B5CF6' },
        'entretenimiento': { icon: 'ticket-percent', color: '#EF4444' },
        'logros': { icon: 'medal', color: '#EAB308' },
        'compras': { icon: 'cart', color: '#10B981' }
      };

      const allPremios = [
        ...(response.data.data.individuales || []),
        ...(response.data.data.grupales || [])
      ];

      const premiosDB = allPremios.map((p: any) => ({
        ...p,
        icon: iconMap[p.categoria]?.icon || 'gift',
        color: iconMap[p.categoria]?.color || '#3B82F6'
      }));

      setPremios(premiosDB);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setPremios(MOCK_PREMIOS);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (id: number, cost: number): Promise<{ success: boolean; message?: string; id_canje?: number }> => {
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para canjear' };
    }

    if (puntos < cost) {
      return { success: false, message: 'Puntos insuficientes' };
    }

    try {
      const response = await api.post('/v1/canjear', { id_premio: id });

      if (response.data.status === 'success') {
        subtractPuntos(cost);
        await fetchPremios();
        return { success: true, message: response.data.message, id_canje: response.data.data.id_canje };
      }
      return { success: false, message: 'Error en el servidor al procesar el canje' };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Ocurrió un error al canjear el premio';
      return { success: false, message: errorMsg };
    }
  };

  const canjearPremio = async (id_premio: number): Promise<string> => {
    const premio = premios.find(p => p.id_premio === id_premio);
    if (!premio) throw new Error('Premio no encontrado');
    const res = await redeemReward(id_premio, premio.costo_puntos);
    if (res.success && res.id_canje) {
      return `ECO-${res.id_canje}`;
    } else {
      throw new Error(res.message || 'Error en el canje');
    }
  };

  return { premios, loading, puntos, canjearPremio, redeemReward };
};
