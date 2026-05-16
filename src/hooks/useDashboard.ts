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

const MOCK_METRICAS: Metricas = {
  huella_carbono_ahorrada: 12.5,
  racha_dias_activos: 5,
  eco_puntos_personales: 1450,
  cantidad_plastico: 14,
  cantidad_papel: 8,
  cantidad_vidrio: 5,
};

const now = new Date();
const subtractDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const formatD = (iso: string) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const MOCK_HISTORIAL: HistorialItem[] = [
  { id_registro: 1, tipo_residuo: 'Plastico', cantidad: 3, puntos_ganados: 50, iso_date: subtractDays(0), fecha_escaneo: formatD(subtractDays(0)) },
  { id_registro: 2, tipo_residuo: 'Vidrio', cantidad: 2, puntos_ganados: 120, iso_date: subtractDays(2), fecha_escaneo: formatD(subtractDays(2)) },
  { id_registro: 3, tipo_residuo: 'Papel', cantidad: 5, puntos_ganados: 40, iso_date: subtractDays(5), fecha_escaneo: formatD(subtractDays(5)) },
  { id_registro: 4, tipo_residuo: 'Plastico', cantidad: 1, puntos_ganados: 15, iso_date: subtractDays(12), fecha_escaneo: formatD(subtractDays(12)) },
  { id_registro: 5, tipo_residuo: 'Papel', cantidad: 10, puntos_ganados: 80, iso_date: subtractDays(25), fecha_escaneo: formatD(subtractDays(25)) },
  { id_registro: 6, tipo_residuo: 'Vidrio', cantidad: 1, puntos_ganados: 60, iso_date: subtractDays(45), fecha_escaneo: formatD(subtractDays(45)) },
  { id_registro: 7, tipo_residuo: 'Plastico', cantidad: 6, puntos_ganados: 100, iso_date: subtractDays(120), fecha_escaneo: formatD(subtractDays(120)) },
  { id_registro: 8, tipo_residuo: 'Papel', cantidad: 2, puntos_ganados: 16, iso_date: subtractDays(400), fecha_escaneo: formatD(subtractDays(400)) },
];

import { usePointsStore } from '@/src/store/usePointsStore';

export const useDashboard = () => {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const globalPoints = usePointsStore((state) => state.puntos);

  useEffect(() => {
    // Simular llamada a API
    const timer = setTimeout(() => {
      setMetricas({ ...MOCK_METRICAS }); // Creamos copia para no mutar el mock global
      setHistorial(MOCK_HISTORIAL);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Override eco_puntos con el global si ya cargaron las métricas
  const metricasSync = metricas ? { ...metricas, eco_puntos_personales: globalPoints } : null;

  return { metricas: metricasSync, historial, loading };
};
