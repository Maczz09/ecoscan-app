import { create } from 'zustand';

interface PointsState {
  puntos: number;
  setPuntos: (amount: number) => void;
  addPuntos: (amount: number) => void;
  subtractPuntos: (amount: number) => boolean;
}

export const usePointsStore = create<PointsState>((set, get) => ({
  puntos: 0, // Inicia en 0, se actualizará al hacer fetch
  setPuntos: (amount: number) => set({ puntos: amount }),
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
