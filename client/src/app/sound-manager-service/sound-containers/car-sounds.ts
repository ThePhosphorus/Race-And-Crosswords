import {CollisionSound} from "./collision-sound";
import {EngineSound} from "./engine-sound";
import {AudioListener, Object3D} from "three";

export class CarSounds {
    public engine: EngineSound;
    public collision: CollisionSound;

    public constructor(soundEmittingObject: Object3D, soundListener: AudioListener, sourcePath?: string) {
        this.engine = new EngineSound(soundEmittingObject, soundListener, sourcePath);
        this.collision = new CollisionSound(soundEmittingObject, soundListener, sourcePath);
    }

    public stop(): void {
        this.engine.stop();
        this.collision.stop();
    }
}
