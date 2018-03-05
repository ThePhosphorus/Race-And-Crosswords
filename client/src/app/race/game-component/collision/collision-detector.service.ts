import { Injectable } from "@angular/core";
import { Scene, Object3D } from "three";

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        // const collidables: Array<Object3D> = scene.children.filter((c) => c.getChildByName("collider") != null);
    }
}
