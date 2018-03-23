import { DOUBLE } from "../global-constants/constants";

// tslint:disable:no-magic-numbers

export const DEFAULT_TRACK_WIDTH: number = 12;
export const TWICE_TRACK_WIDTH: number = DOUBLE * DEFAULT_TRACK_WIDTH;
export const PERS_CAMERA_ANGLE: number = 25;

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DRAG_COEFFICIENT: number = 0.35;

export const DEFAULT_DRIVE_RATIO: number = 3.27;
export const DEFAULT_DOWNSHIFT_RPM: number = 3000;
export const DEFAULT_MINIMUM_RPM: number = 800;
export const DEFAULT_SHIFT_RPM: number = 6900;
export const DEFAULT_TRANSMISSION_EFFICIENCY: number = 0.7;
export const DEFAULT_MAX_RPM: number = 7000;
export const DEFAULT_GEAR_RATIOS: number[] = [
    4.4,
    2.59,
    1.8,
    1.34,
    1,
    0.75
];

export const DEFAULT_WHEEL_RADIUS: number = 0.3505; // 245/50R18
export const DEFAULT_WHEEL_MASS: number = 15;
export const DEFAULT_FRICTION_COEFFICIENT: number = 1;

export const DEFAULT_VOLUME: number = 0.5;
