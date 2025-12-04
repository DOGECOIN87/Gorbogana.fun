export enum RoastIntensity {
  MILD = 'MILD',
  SPICY = 'SPICY',
  NUCLEAR = 'NUCLEAR'
}

export interface TrashItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  emoji: string;
  scale: number;
}

export interface RoastResponse {
  roast: string;
  rating: number; // 1-10 scale of how bad the typo was
}