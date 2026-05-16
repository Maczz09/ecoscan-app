import { useState, useEffect } from 'react';

export type FiltroTiempo = 'SEMANA' | 'MES' | 'AÑO';

// Tipo de las recomendaciones
export interface Recomendacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'POSITIVO' | 'MEJORA' | 'ALERTA';
}

export const useDashboardGrupal = () => {
  const [filtro, setFiltro] = useState<FiltroTiempo>('SEMANA');
  const [loading, setLoading] = useState(false);

  // MOCK DATA: Para simular la carga y el cambio de filtros
  const [data, setData] = useState({
    puntos_totales: 0,
    co2_ahorrado: 0,
    materiales: { plastico: 0, papel: 0, vidrio: 0 },
    aporte_miembros: [] as any[],
    recomendaciones: [] as Recomendacion[]
  });

  useEffect(() => {
    setLoading(true);
    // Simulamos una llamada a la API
    setTimeout(() => {
      let mockData;

      if (filtro === 'SEMANA') {
        mockData = {
          puntos_totales: 450,
          co2_ahorrado: 12.5,
          materiales: { plastico: 12, papel: 8, vidrio: 5 }, // Cantidad, NO Kilos
          aporte_miembros: [
            { value: 200, label: 'Max', frontColor: '#10B981' },
            { value: 150, label: 'Ana', frontColor: '#3B82F6' },
            { value: 100, label: 'Carlos', frontColor: '#F59E0B' },
          ],
          recomendaciones: [
            { id: '1', titulo: '¡Excelente ritmo!', mensaje: 'Max ha sido el mayor aportador esta semana.', tipo: 'POSITIVO' },
            { id: '2', titulo: 'Falta Vidrio', mensaje: 'Han reciclado pocos envases de vidrio, recuerden separarlos bien.', tipo: 'MEJORA' },
          ]
        };
      } else if (filtro === 'MES') {
        mockData = {
          puntos_totales: 2480,
          co2_ahorrado: 54.2,
          materiales: { plastico: 45, papel: 30, vidrio: 18 },
          aporte_miembros: [
            { value: 1200, label: 'Max', frontColor: '#10B981' },
            { value: 850, label: 'Ana', frontColor: '#3B82F6' },
            { value: 430, label: 'Carlos', frontColor: '#F59E0B' },
          ],
          recomendaciones: [
            { id: '1', titulo: '¡Gran Trabajo en Equipo!', mensaje: 'Han superado su meta mensual de plástico.', tipo: 'POSITIVO' },
            { id: '2', titulo: 'Atención con el Papel', mensaje: 'El reciclaje de cartón/papel bajó respecto al mes pasado.', tipo: 'ALERTA' },
          ]
        };
      } else {
        // AÑO
        mockData = {
          puntos_totales: 15400,
          co2_ahorrado: 320.8,
          materiales: { plastico: 350, papel: 210, vidrio: 145 },
          aporte_miembros: [
            { value: 7200, label: 'Max', frontColor: '#10B981' },
            { value: 5100, label: 'Ana', frontColor: '#3B82F6' },
            { value: 3100, label: 'Carlos', frontColor: '#F59E0B' },
          ],
          recomendaciones: [
            { id: '1', titulo: 'Impacto Real', mensaje: 'Han salvado el equivalente a 5 árboles este año.', tipo: 'POSITIVO' },
          ]
        };
      }

      setData(mockData as any);
      setLoading(false);
    }, 800);
  }, [filtro]);

  return { filtro, setFiltro, data, loading };
};
