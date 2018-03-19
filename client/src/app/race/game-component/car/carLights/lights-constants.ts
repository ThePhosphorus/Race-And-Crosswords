import { Vector3 } from "three";

// tslint:disable:no-magic-numbers
export const FAR_LIGHT_DISTANCE: number = 25;
export const NEAR_LIGHT_DISTANCE: number = 2;
export const FRONT_LIGHT_PENUMBRA: number = 0.4;

export const FRONT_LIGHT_COLOR: number = 0xFFE6CC;
export const FRONT_LIGHT_ANGLE: number = 0.6;
export const FRONT_LIGHT_HEIGHT: number = 0.8;
export const FRONT_LIGHT_OFFSET: number = 1;
export const FRONT_LIGHT_LATERAL_OFFSET: number = 0;
export const FRONT_LIGHT_INTENSITY: number = 5;

export const BACK_LIGHT_PENUMBRA: number = 0.6;
export const BACK_LIGHT_HEIGHT: number = 0.75;
export const BACK_LIGHT_LATERAL_OFFSET: number = 0;
export const BACK_LIGHT_OFFSET: number = -1.3;
export const BACK_LIGHT_INTENSITY: number = 0.2;

export const SMALL_LIGHT_ANGLE: number = 0.1;
export const BIG_LATERAL_OFFSET: number = 0.45;
export const SMALL_LIGHT_HEIGHT: number = 0.6;
export const SMALL_LIGHT_OFFSET: number = 2;
export const SMALL_LIGHT_INTENSITY: number = 10;

export const BACK_LIGHT_POSITION: Vector3 = new Vector3(0, 0.7, 1.4);
export const BACK_LIGHT_TARGET: Vector3 = new Vector3(0, 0, 7);

export const POSITION_OFFSET: Vector3 = new Vector3(0, 0.1, 0);
export const TARGET_OFFSET: Vector3 = new Vector3(0, 2.1, 0);

export const EXT_LEFT_LIGHT_POSITION: Vector3 = new Vector3(-0.47, SMALL_LIGHT_HEIGHT, SMALL_LIGHT_OFFSET);
export const EXT_LEFT_LIGHT_TARGET: Vector3 = new Vector3(0.5, 0.8, -10 );
export const INT_LEFT_LIGHT_POSITION: Vector3 = new Vector3(-0.29, SMALL_LIGHT_HEIGHT, SMALL_LIGHT_OFFSET);
export const INT_LEFT_LIGHT_TARGET: Vector3 = new Vector3(0.25, 0.8, -10 );
export const INT_RIGHT_LIGHT_POSITION: Vector3 = new Vector3(0.27, SMALL_LIGHT_HEIGHT, SMALL_LIGHT_OFFSET);
export const INT_RIGHT_LIGHT_TARGET: Vector3 = new Vector3(0.25, 0.8, -10 );
export const EXT_RIGHT_LIGHT_POSITION: Vector3 = new Vector3(0.44, SMALL_LIGHT_HEIGHT, SMALL_LIGHT_OFFSET);
export const EXT_RIGHT_LIGHT_TARGET: Vector3 = new Vector3(0.5, 0.8, -10 );
export const FRONT_LIGHT_POSITION: Vector3 = new Vector3(0, FRONT_LIGHT_HEIGHT, -1.4);
export const FRONT_LIGHT_TARGET: Vector3 = new Vector3(0, 0.8, -10);
