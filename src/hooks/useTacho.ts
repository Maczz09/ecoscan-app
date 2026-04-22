import { useState, useEffect } from 'react';

export interface DashboardData {
  tacho: {
    codigo_qr: string;
    estado_operativo: string;
    nivel_llenado_plastico: number;
    nivel_llenado_papel: number;
    nivel_llenado_organico: number;
    nivel_llenado_vidrio: number;
    ultima_conexion: string;
  };
  metricas: {
    eco_puntos_personales: number; 
    racha_dias_activos: number;    
  };
}

export const useTacho = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData({
        tacho: {
          codigo_qr: 'ECO-9922-XP',
          estado_operativo: 'ACTIVO',
          nivel_llenado_plastico: 85,
          nivel_llenado_papel: 40,
          nivel_llenado_organico: 15,
          nivel_llenado_vidrio: 60,
          ultima_conexion: 'Hace 5 min'
        },
        metricas: {
          eco_puntos_personales: 1250,
          racha_dias_activos: 14
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return { data, isLoading };
};