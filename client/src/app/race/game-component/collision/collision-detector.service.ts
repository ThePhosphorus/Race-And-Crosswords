import { Injectable } from "@angular/core";
import { Scene, Vector2 } from "three";
import { Collider } from "./colliders/collider";
import { BoxCollider } from "./colliders/box-collider";
import { LineCollider } from "./colliders/line-collider";
import { Projected } from "./projection";

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        // Fetch all colliders
        const colliders: Array<Collider> = this.getColliders(scene);
        for (let i: number = 0; i < colliders.length; i++) {
            for (let j: number = i + 1; j < colliders.length; j++) {
                if (this.broadDetection(colliders[i], colliders[j])) {
                    const intersection: boolean = this.narrowDetection(colliders[i], colliders[j]);
                    if (intersection) {
                        this.resolveCollision(colliders[i], colliders[j], intersection);
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

        return null;
    }

    private boxBoxDetection(coll1: BoxCollider, coll2: BoxCollider): boolean {
        const vertexes1: Array<Vector2> = coll1.getAbsoluteVertexes2D();
        const vertexes2: Array<Vector2> = coll2.getAbsoluteVertexes2D();
        const axises: Array<Vector2> = coll1.getNormals().concat(coll2.getNormals());
        let minDistance: number = Number.MAX_VALUE;
        let minAxis: Vector2 = null;

        for (const normal of axises) {
            const projected1: Projected = new Projected(vertexes1, normal);
            const projected2: Projected = new Projected(vertexes2, normal);
            const distance: number = projected1.distance(projected2);
            if (distance > 0) {
                return false;
            }
            if (Math.abs(distance) < minDistance) {
                minDistance = Math.abs(distance);
                minAxis = normal;
            }
        }

        return true;
    }

    private boxLineDetection(box: BoxCollider, line: LineCollider): boolean {
        return false;
    }

    private resolveCollision(coll1: Collider, coll2: Collider, intersection: boolean): void {
        console.log("collision");
    }
}
