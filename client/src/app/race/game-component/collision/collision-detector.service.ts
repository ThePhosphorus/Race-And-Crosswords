import { Injectable } from "@angular/core";
import { Scene } from "three";
import { Collider } from "./colliders/collider";

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        // Fetch all colliders
        const colliders: Array<Collider> = this.getColliders(scene);
        for (let i: number = 0; i < colliders.length; i++) {
            for (let j: number = i + 1; j < colliders.length; j++) {
                if (this.broadDetection(colliders[i], colliders[j])) {
                    if (this.narrowDetection(colliders[i], colliders[j])) {
                        this.resolveCollision(colliders[i], colliders[j]);
                    }
                }
            }
        }
    }

    private getColliders(scene: Scene): Array<Collider> {
        const colliders: Array<Collider> = new Array<Collider>();
        scene.traverse((obj) => {
            if (obj instanceof Collider) {
                colliders.push(obj);
            }
        })

        return colliders;
    }

    private broadDetection(coll1: Collider, coll2: Collider): boolean {
        return coll2.getAbsolutePosition().clone().sub(coll1.getAbsolutePosition()).length() <= (coll1.getBroadRadius() + coll2.getBroadRadius());
    }

    private narrowDetection(coll1: Collider, coll2: Collider): boolean {
        return true;
    }

    private resolveCollision(coll1: Collider, coll2: Collider): void {
        console.log("COLLISION");
    }
}
