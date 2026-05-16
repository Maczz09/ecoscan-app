import { useState, useEffect } from 'react';
import { usePointsStore } from '../store/usePointsStore';
import { useAuthStore } from '../store/useAuthStore';

export interface Premio {
  id_premio: number;
  nombre_premio: string;
  descripcion: string;
  costo_puntos: number;
  stock_disponible: number;
  icon: string; // Para usar con MaterialCommunityIcons
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
    // Simular API
    setTimeout(() => {
      setPremios(MOCK_PREMIOS);
      setLoading(false);
    }, 600);
  }, []);

  const canjearPremio = (id_premio: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const premio = premios.find(p => p.id_premio === id_premio);
      if (!premio) return reject(new Error('Premio no encontrado'));
      if (premio.stock_disponible <= 0) return reject(new Error('Sin stock'));

      if (subtractPuntos(premio.costo_puntos)) {
        // Disminuir stock localmente
        setPremios(prev => prev.map(p => 
          p.id_premio === id_premio ? { ...p, stock_disponible: p.stock_disponible - 1 } : p
        ));
        
        // Generar un ID de Canje simulado
        const idCanje = `ECO-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        resolve(idCanje);
      } else {
        reject(new Error('Puntos insuficientes'));
      }
    });
  };

  return { premios, loading, puntos, canjearPremio };
};
