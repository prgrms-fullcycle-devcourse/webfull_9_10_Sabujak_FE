export const MAX_HEARTS = 50;
export const HEART_SCALE_MIN = 0.2;
export const HEART_SCALE_MAX = 0.8;

export const JAR_BOUNDS = {
  centerX: 125.5,
  top: 265,
  bottom: 345,
} as const;

export const HEART_BOX = {
  width: 10,
  centerX: 15,
  centerYOffset: 4,
} as const;

export const HEART_HUE_RANGES = [
  [10, 40],
  [50, 60],
  [175, 220],
  [332, 390],
] as const;
