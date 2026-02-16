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

  isMuted: boolean;
  toggleMute: () => void;

  lots: Lot[];
  activeLot: string | null;
  setActiveLot: (id: string | null) => void;

  weather: 'sunny' | 'rain' | 'snow';
  setWeather: (weather: 'sunny' | 'rain' | 'snow') => void;
}

export interface Lot {
  id: string;
  position: [number, number, number];
  size: [number, number]; // width, depth
  price: string;
  area: string;
  status: 'available' | 'sold' | 'reserved';
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

  isMuted: true,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  lots: [
    { id: 'lot-101', position: [-15, 0.1, 15], size: [10, 10], price: '$1,200,000', area: '500 м²', status: 'available' },
    { id: 'lot-102', position: [-25, 0.1, 5], size: [12, 8], price: '$950,000', area: '400 м²', status: 'reserved' },
    { id: 'lot-103', position: [15, 0.1, -15], size: [15, 15], price: '$2,500,000', area: '800 м²', status: 'available' },
    { id: 'lot-104', position: [25, 0.1, -5], size: [8, 12], price: '$800,000', area: '350 м²', status: 'sold' },
  ],
  activeLot: null,
  setActiveLot: (id) => set({ activeLot: id }),

  weather: 'sunny',
  setWeather: (weather) => set({ weather }),
}));