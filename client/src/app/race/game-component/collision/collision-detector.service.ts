import { Injectable } from "@angular/core";
import { Scene, Vector3, Raycaster, Intersection, Ray, Box3 } from "three";
import { Collider } from "./colliders/collider";
import { BoxCollider } from "./colliders/box-collider";
import { LineCollider } from "./colliders/line-collider";

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
        });

        return colliders;
    }

    private broadDetection(coll1: Collider, coll2: Collider): boolean {
        return !(coll1 instanceof LineCollider && coll2 instanceof LineCollider) &&
            coll2.getAbsolutePosition().clone().sub(
                coll1.getAbsolutePosition()).length() <= (coll1.getBroadRadius() + coll2.getBroadRadius());
    }

    private narrowDetection(coll1: Collider, coll2: Collider): boolean {
        if (coll1 instanceof LineCollider && coll2 instanceof BoxCollider) {
            return this.boxLineDetection(coll2, coll1);
        } else if (coll2 instanceof LineCollider && coll1 instanceof BoxCollider) {
            return this.boxLineDetection(coll1, coll2);
        } else if (coll1 instanceof BoxCollider && coll2 instanceof BoxCollider) {
            return this.boxBoxDetection(coll1, coll2);
        }

        return false;
    }

    private boxBoxDetection(coll1: BoxCollider, coll2: BoxCollider): boolean {

        for (const vertex of coll1.getVertexes()) {
            const globalVertex: Vector3 = vertex.clone().applyMatrix4(coll1.parent.matrix);
            const directionVector: Vector3 = globalVertex.clone().sub(coll1.getAbsolutePosition());
            const ray: Ray = new Ray(coll1.getAbsolutePosition(), directionVector.clone().normalize());
            const collisionResults: Boolean = ray.intersectsBox(new Box3().setFromObject(coll2.parent));
            if (collisionResults) {
                return true;
            }
        }

        return false;
    }

    private boxLineDetection(box: BoxCollider, line: LineCollider): boolean {
        return true;
    }

    private resolveCollision(coll1: Collider, coll2: Collider): void {

    }
}
