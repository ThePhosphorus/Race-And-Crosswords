import { Mesh, Object3D } from "three";
import { Track } from "../../../../../../common/race/track";

export class GameConfiguration {
    public constructor(
        public track: Track = null,
        public trackMeshs: Array<Mesh> = null,
        public trackWalls: Array<Object3D> = null
    ) {}
}
