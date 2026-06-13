import { useState, useEffect } from 'react';
import { Premio } from './useRewards';
import api from '../services/api';

export interface CanjeRealizado {
  id_canje: string; // El código ECO-XXXXXX
  premio: Premio;
  fecha_canje: string;
}

const MOCK_MIS_CANJES: CanjeRealizado[] = [
  {
    id_canje: 'ECO-102934',
    fecha_canje: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    premio: {
      id_premio: 1,
      nombre_premio: 'Bolsa Ecológica Tela',
      descripcion: 'Bolsa reutilizable de algodón orgánico con el logo de EcoScan.',
      costo_puntos: 500,
      stock_disponible: 50,
      icon: 'shopping',
      color: '#10B981'
    }
  },
  {
    id_canje: 'ECO-847201',
    fecha_canje: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    premio: {
      id_premio: 4,
      nombre_premio: 'Set Cubiertos Bambú',
      descripcion: 'Ideal para comer fuera sin usar plásticos desechables.',
      costo_puntos: 600,
      stock_disponible: 30,
      icon: 'silverware-fork-knife',
      color: '#8B5CF6'
    }
  }
];

export const useMisCanjes = () => {
  const [misCanjes, setMisCanjes] = useState<CanjeRealizado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMisCanjes();
  }, []);

  const fetchMisCanjes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/mis-canjes');
      
      const iconMap: Record<string, { icon: string, color: string }> = {
        'comida': { icon: 'food', color: '#F59E0B' },
        'merchandising': { icon: 'shopping', color: '#8B5CF6' },
        'entretenimiento': { icon: 'ticket-percent', color: '#EF4444' },
        'logros': { icon: 'medal', color: '#EAB308' },
        'compras': { icon: 'cart', color: '#10B981' }
      };

      const allCanjes = [
        ...(response.data.data.individuales || []),
        ...(response.data.data.grupales || [])
      ];

      const canjesDB = allCanjes.map((c: any) => ({
        id_canje: `ECO-${c.id_canje}`,
        fecha_canje: c.fecha_canje,
        premio: {
          id_premio: c.reward.id_premio,
          nombre_premio: c.reward.nombre_premio,
          descripcion: c.reward.descripcion,
          costo_puntos: c.reward.costo_puntos,
          stock_disponible: c.reward.stock_disponible,
          icon: iconMap[c.reward.categoria]?.icon || 'gift',
          color: iconMap[c.reward.categoria]?.color || '#3B82F6'
        }
      }));

      setMisCanjes(canjesDB);
    } catch (error) {
      console.error('Error fetching mis canjes:', error);
      // Fallback a mocks en caso de error o base de datos vacía
      setMisCanjes(MOCK_MIS_CANJES);
    } finally {
      setLoading(false);
    }
  };

  return { misCanjes, loading, refreshCanjes: fetchMisCanjes };
};
