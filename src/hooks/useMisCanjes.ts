import { useState, useEffect } from 'react';
import { Premio } from './useRewards';

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
    const timer = setTimeout(() => {
      setMisCanjes(MOCK_MIS_CANJES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { misCanjes, loading };
};
