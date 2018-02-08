import { Vector3, MeshBasicMaterial, SphereGeometry, LineBasicMaterial } from "three";

export const STARTING_CAMERA_HEIGHT: number = 60;
export const CAMERA_STARTING_POSITION: Vector3 = new Vector3(0, STARTING_CAMERA_HEIGHT, 0);
export const CAMERA_STARTING_DIRECTION: Vector3 = new Vector3(0, -1, 0);

export const GRID_DIMENSION: number = 10000;
export const GRID_DIVISIONS: number = 1000;
export const GRID_PRIMARY_COLOR: number = 0xFFFF00;
export const GRID_SECONDARY_COLOR: number = 0x001188;

export const WHITE: number = 0xFFFFFF;
export const SELECTION_COLOR: number = 0x44D3FF;
export const AMBIENT_LIGHT_OPACITY: number = 0.85;

const SPHERE_RADIUS: number = 2;
const SPHERE_SEGMENTS: number = 32;
export const SPHERE_GEOMETRY: SphereGeometry = new SphereGeometry(SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS);
export const WHITE_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color: WHITE});
export const LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({color: 0x00FF00});
export const LINE_MATERIAL_INVALID: LineBasicMaterial = new LineBasicMaterial ({color: 0xFF0000});
export const SELECTION_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color: SELECTION_COLOR});

export const POINT_SELECT_DISTANCE: number  = 15;
export const LINE_Y_POSITION: number = 1;

export const START_POINT_COLOR: number = 0x22FF22;
export const START_POINT_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({color: START_POINT_COLOR});
