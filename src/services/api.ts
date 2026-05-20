import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// URL para la API en entorno de desarrollo usando la IP local de la PC
const API_URL = 'http://192.168.100.5:8000/api/v1'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

// Request interceptor: Añadir token de Auth si existe
api.interceptors.request.use(
  (config) => {
    // Obtenemos el estado directamente sin hooks de React
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Manejar errores globales (ej: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el token expira o es inválido, cerrar sesión
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
