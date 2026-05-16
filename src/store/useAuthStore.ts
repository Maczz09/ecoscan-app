import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Rol } from '../types/database';

// Tipado basado en la tabla 'usuarios'
interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: Rol;
  id_grupo?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      // Función para guardar al usuario y su token
      setAuth: (user, token) => set({ user, token }),
      
      // Función para cerrar sesión y limpiar datos
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'ecoscan-auth-storage', // Nombre del archivo interno en el celular
      storage: createJSONStorage(() => AsyncStorage), // Usamos el storage nativo
    }
  )
);