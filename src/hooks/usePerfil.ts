import { useState, useEffect } from 'react';
import { Usuario } from '@/src/types/database';

const MOCK_USER: Usuario = {
  id_usuario: 1,
  id_familia: 1,
  nombre: 'Maximiliano',
  email: 'max@ecoscan.com',
  estado_cuenta: 'VERIFICADO',
  eco_puntos_personales: 1250,
  fecha_registro: new Date('2025-01-15T10:00:00Z').toISOString(),
  familia: {
    id_familia: 1,
    nombre_familia: 'Familia Eco',
    id_tacho_asignado: 101,
    puntos_grupales: 3400,
    fecha_creacion: new Date('2025-01-10T10:00:00Z').toISOString(),
  }
};

export const usePerfil = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Simulando llamada a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser(MOCK_USER);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    // Aquí irá la lógica de cerrar sesión, borrar tokens, etc.
    console.log('Cerrando sesión...');
  };

  return {
    user,
    loading,
    logout
  };
};
