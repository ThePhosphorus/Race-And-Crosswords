import { Injectable } from "@angular/core";
import { Scene, Vector2 } from "three";
import { Collider } from "./colliders/collider";
import { BoxCollider } from "./colliders/box-collider";
import { LineCollider } from "./colliders/line-collider";
import { Projected } from "./projection";
import { Collision } from "./collision";
import { RigidBody } from "../rigid-body/rigid-body";

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        // Fetch all colliders
        const colliders: Array<Collider> = this.getColliders(scene);
        for (let i: number = 0; i < colliders.length; i++) {
            for (let j: number = i + 1; j < colliders.length; j++) {
                if (this.broadDetection(colliders[i], colliders[j])) {
                    const collision: Collision = this.narrowDetection(colliders[i], colliders[j]);
                    if (collision != null) {
                        this.resolveCollision(collision);
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

    private narrowDetection(coll1: Collider, coll2: Collider): Collision {
        if (coll1 instanceof BoxCollider && coll2 instanceof BoxCollider) {
            return this.boxBoxDetection(coll1, coll2);
        }

        return null;
    }

    private boxBoxDetection(coll1: BoxCollider, coll2: BoxCollider): Collision {
        const vertexes1: Array<Vector2> = coll1.getAbsoluteVertexes2D();
        const vertexes2: Array<Vector2> = coll2.getAbsoluteVertexes2D();
        const axises: Array<Vector2> = coll1.getNormals().concat(coll2.getNormals());
        let minDistance: number = Number.MAX_VALUE;
        const collision: Collision = new Collision(coll1, null, coll2, null);

        for (const normal of axises) {
            const projected1: Projected = new Projected(vertexes1, normal);
            const projected2: Projected = new Projected(vertexes2, normal);
            const distance: number = projected1.distance(projected2);
            if (distance > 0) {
                return null;
            }
            if (Math.abs(distance) < minDistance) {
                minDistance = Math.abs(distance);
                this.addCollisionIntersection(collision, projected1, projected2);
            }
        }

        return collision;
    }
    private addCollisionIntersection(collision: Collision, projected1: Projected, projected2: Projected ): void {
        collision.collidingPoint1 = this.findIntersection(projected1, projected2);
        collision.collidingPoint2 = this.findIntersection(projected2, projected1);
    }

    private findIntersection(projected1: Projected, projected2: Projected): Vector2 {
        const maxProjectedDistance: number = projected2.minProjected - projected1.maxProjected;
        const minProjectedDistance: number = projected1.minProjected - projected2.maxProjected;
        let projected1Vertexes: Array<Vector2> = null;
        let projected2Vertexes: Array<Vector2> = null;

        if (maxProjectedDistance > minProjectedDistance) {
            projected1Vertexes = projected1.maxVertexes;
            projected2Vertexes = projected2.minVertexes;
        } else {
            projected1Vertexes = projected1.minVertexes;
            projected2Vertexes = projected2.maxVertexes;
        }

        // if (projected1Vertexes.length === 1) {
        //     return projected1Vertexes[0];
        // } else {
        //     return projected2Vertexes[0];
        // }
        return new Vector2();
    }

    private resolveCollision(collision: Collision): void {
        const rb1: RigidBody = collision.coll1.parent.children.find((c) => c instanceof RigidBody) as RigidBody;
        const rb2: RigidBody = collision.coll1.parent.children.find((c) => c instanceof RigidBody) as RigidBody;

        if (rb1 != null && rb2 != null) {
            const m1: number = rb1.mass;
            const m2: number = rb2.mass;

            const v1: Vector2 = rb1.velocity;
            const v2: Vector2 = rb2.velocity;

            rb1.applyCollision(collision.collidingPoint1, m2, v2);
            rb2.applyCollision(collision.collidingPoint2, m1, v1);
        }
    }
}
