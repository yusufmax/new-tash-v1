export interface CityLayer {
  id: string;
  label: string;
  active: boolean;
  color: string;
}

export interface SectionData {
  id: number;
  title: string;
  description: string;
  progressStart: number;
  progressEnd: number;
}

export enum CameraMode {
  SCROLL = 'SCROLL', // Camera follows the curve based on scroll
  EXPLORE = 'EXPLORE' // User has free control (Orbit/Map controls)
}
