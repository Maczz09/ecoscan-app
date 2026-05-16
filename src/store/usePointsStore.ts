import { create } from 'zustand';

interface PointsState {
  puntos: number;
  addPuntos: (amount: number) => void;
  subtractPuntos: (amount: number) => boolean;
}

export const usePointsStore = create<PointsState>((set, get) => ({
  puntos: 1450, // Valor inicial mockeado
  addPuntos: (amount: number) => set((state) => ({ puntos: state.puntos + amount })),
  subtractPuntos: (amount: number) => {
    const { puntos } = get();
    if (puntos >= amount) {
      set({ puntos: puntos - amount });
      return true;
    }
    return false;
  },
}));
