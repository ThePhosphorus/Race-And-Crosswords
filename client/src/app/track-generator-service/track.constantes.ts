import { Vector3, MeshBasicMaterial, SphereGeometry } from "three";

export const STARTING_CAMERA_HEIGHT: number = 60;
export const CAMERA_STARTING_POSITION: Vector3 = new Vector3(0, STARTING_CAMERA_HEIGHT, 0);
export const CAMERA_STARTING_DIRECTION: Vector3 = new Vector3(0, -1, 0);

export const GRID_DIMENSION: number = 10000;
export const GRID_DIVISIONS: number = 1000;
export const GRID_PRIMARY_COLOR: number = 0xFF0000;
export const GRID_SECONDARY_COLOR: number = 0x001188;

export const WHITE: number = 0xFFFFFF;
export const SELECTION_COLOR: number = 0xFF5555;
export const AMBIENT_LIGHT_OPACITY: number = 0.85;

export const SPHERE_GEOMETRY: SphereGeometry = new SphereGeometry(2, 32, 32);
export const WHITE_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color: WHITE});
export const SELECTION_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color: SELECTION_COLOR});

export const POINT_SELECT_DISTANCE: number  = 15;
