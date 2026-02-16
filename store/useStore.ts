import { create } from 'zustand';
import { CameraMode, CityLayer } from '../types';

interface AppState {
  mode: CameraMode;
  setMode: (mode: CameraMode) => void;

  scrollProgress: number; // 0 to 1
  setScrollProgress: (progress: number) => void;

  layers: CityLayer[];
  toggleLayer: (id: string) => void;

  activeSection: number;
  setActiveSection: (index: number) => void;

  isNight: boolean;
  setIsNight: (isNight: boolean) => void;

  isExploded: boolean;
  setIsExploded: (isExploded: boolean) => void;

  activePOI: string | null;
  setActivePOI: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  mode: CameraMode.SCROLL,
  setMode: (mode) => set({ mode }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  layers: [
    { id: 'buildings', label: 'Архитектура', active: true, color: '#e5e5e5' },
    { id: 'transport', label: 'Транспорт', active: true, color: '#2dd4bf' }, // Teal
    { id: 'greenery', label: 'Зеленые Зоны', active: true, color: '#0f766e' }, // Dark Teal
    { id: 'water', label: 'Набережная', active: true, color: '#3b82f6' },
  ],
  toggleLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, active: !layer.active } : layer
      ),
    })),

  activeSection: 0,
  setActiveSection: (index) => set({ activeSection: index }),

  isNight: true,
  setIsNight: (isNight) => set({ isNight }),

  isExploded: false,
  setIsExploded: (isExploded) => set({ isExploded }),

  activePOI: null,
  setActivePOI: (id) => set({ activePOI: id }),
}));