import { Injectable } from "@angular/core";
import { Scene, Vector2 } from "three";
import { Collider } from "./colliders/collider";
import { BoxCollider } from "./colliders/box-collider";
import { LineCollider } from "./colliders/line-collider";

class MinMax {
    public minProj: number;
    public maxProj: number;
    public minIndex: number;
    public maxIndex: number;
}

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
        const normals1: Array<Vector2> = coll1.getNormals();
        const normals2: Array<Vector2> = coll2.getNormals();
        const vertexes1: Array<Vector2> = coll1.getAbsoluteVertexes2D();
        const vertexes2: Array<Vector2> = coll2.getAbsoluteVertexes2D();

        for (const normal of normals1) {
            const minMax1: MinMax = this.getMinMax(vertexes1, normal);
            const minMax2: MinMax = this.getMinMax(vertexes2, normal);
            if (minMax1.maxProj < minMax2.minProj || minMax2.maxProj < minMax1.minProj) {
                return false;
            }
        }

        for (const normal of normals2) {
            const minMax1: MinMax = this.getMinMax(vertexes1, normal);
            const minMax2: MinMax = this.getMinMax(vertexes2, normal);
            if (minMax1.maxProj < minMax2.minProj || minMax2.maxProj < minMax1.minProj) {
                return false;
            }
        }

        return true;
    }

    private getMinMax(vertexes: Array<Vector2>, axis: Vector2): MinMax {
        const minMax: MinMax = new MinMax();
        minMax.minProj = vertexes[0].dot(axis);
        minMax.maxProj = vertexes[0].dot(axis);
        minMax.minIndex = 0;
        minMax.maxIndex = 0;

        for (let i: number = 1; i < vertexes.length; i++) {
            const currProj: number = vertexes[i].dot(axis);
            if (minMax.minProj > currProj) {
                minMax.minProj = currProj;
                minMax.minIndex = i;
            }
            if (currProj > minMax.maxProj) {
                minMax.maxProj = currProj;
                minMax.maxIndex = i;
            }
        }

        return minMax;
    }

    private boxLineDetection(box: BoxCollider, line: LineCollider): boolean {
        return false;
    }

    private resolveCollision(coll1: Collider, coll2: Collider, intersection: boolean): void {
        console.log("collision");

    }
}
