import { Mesh, Object3D } from "three";

export class GameConfiguration {
    public constructor(
        public trackMeshs: Array<Mesh> = null,
        public trackWalls: Array<Object3D> = null
    ) {}
}
