import { useState, useEffect } from 'react';

export interface Metricas {
  huella_carbono_ahorrada: number;
  racha_dias_activos: number;
  eco_puntos_personales: number;
  kg_plastico: number;
  kg_papel: number;
  kg_organico: number;
  kg_vidrio: number;
}

export interface HistorialItem {
  id_registro: number;
  tipo_residuo: 'Plastico' | 'Papel' | 'Organico' | 'Vidrio';
  peso_kg: number;
  puntos_ganados: number;
  fecha_escaneo: string;
}

const MOCK_METRICAS: Metricas = {
  huella_carbono_ahorrada: 12.5,
  racha_dias_activos: 5,
  eco_puntos_personales: 1450,
  kg_plastico: 4.2,
  kg_papel: 2.1,
  kg_organico: 8.5,
  kg_vidrio: 1.8,
};

const MOCK_HISTORIAL: HistorialItem[] = [
  { id_registro: 1, tipo_residuo: 'Plastico', peso_kg: 0.5, puntos_ganados: 50, fecha_escaneo: '25 Oct, 14:30' },
  { id_registro: 2, tipo_residuo: 'Vidrio', peso_kg: 1.2, puntos_ganados: 120, fecha_escaneo: '24 Oct, 09:15' },
  { id_registro: 3, tipo_residuo: 'Papel', peso_kg: 0.8, puntos_ganados: 40, fecha_escaneo: '22 Oct, 16:45' },
];

export const useDashboard = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular llamada a API
    const timer = setTimeout(() => {
      setMetricas(MOCK_METRICAS);
      setHistorial(MOCK_HISTORIAL);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { metricas, historial, loading };
};
