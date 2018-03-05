import { Injectable } from "@angular/core";
import { Scene, Object3D } from "three";
import { Collider } from "./colliders/collider";

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        // Fetch all colliders
        const collidables: Array<Collider> = scene.children.reduce((prev, curr) => [...prev, ...curr.children
                .filter((f) => f instanceof Collider)], new Array<Object3D>()) as Collider[];
        for (let i: number = 0; i < collidables.length; i++) {
            for (let j: number = i; j < collidables.length; j++) {
                if (this.broadDetection(collidables[i], collidables[j])) {
                    if (this.narrowDetection(collidables[i], collidables[j])) {
                        this.resolveCollision(collidables[i], collidables[j]);
                    }
                }
            }
        }
    }

    private broadDetection(coll1: Collider, coll2: Collider): boolean {
        return true;
    }

    private narrowDetection(coll1: Collider, coll2: Collider): boolean {
        return true;
    }

    private resolveCollision(coll1: Collider, coll2: Collider): void {
        console.log("COLLISION");
    }
}
