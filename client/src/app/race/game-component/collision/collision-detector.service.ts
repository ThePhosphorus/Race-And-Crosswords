import { Injectable } from "@angular/core";
import { Scene, Vector2, Vector3 } from "three";
import { Collider } from "./collider";
import { Projected } from "./projection";
import { Collision } from "./collision";
import { RigidBody } from "../rigid-body/rigid-body";
const OVERLAP_FACTOR: number = 4;

@Injectable()
export class CollisionDetectorService {

    public constructor() { }

    public detectCollisions(scene: Scene): void {
        const colliders: Array<Collider> = this.getColliders(scene);
        for (let i: number = 0; i < colliders.length; i++) {
            for (let j: number = i + 1; j < colliders.length; j++) {
                if (this.broadDetection(colliders[i], colliders[j])) {
                    const collision: Collision = this.boxBoxDetection(colliders[i], colliders[j]);
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
        return coll2.getAbsolutePosition().clone().sub(
                coll1.getAbsolutePosition()).length() <= (coll1.getBroadRadius() + coll2.getBroadRadius());
    }

    private boxBoxDetection(coll1: Collider, coll2: Collider): Collision {
        const vertexes1: Array<Vector2> = coll1.getAbsoluteVertexes2D();
        const vertexes2: Array<Vector2> = coll2.getAbsoluteVertexes2D();
        const axises: Array<Vector2> = coll1.getNormals().concat(coll2.getNormals());
        let minDistance: number = Number.MAX_VALUE;
        let distanceNormal: Vector2 = new Vector2();

        for (const normal of axises) {
            const projected1: Projected = new Projected(vertexes1, normal.clone());
            const projected2: Projected = new Projected(vertexes2, normal.clone());
            const distance: number = projected1.distance(projected2);
            if (distance > 0) {
                return null;
            }
            if (Math.abs(distance) < minDistance) {
                minDistance = Math.abs(distance);
                distanceNormal = normal.clone();
            }
        }

        return new Collision(coll1, coll2, distanceNormal, -minDistance);
    }

    private resolveCollision(collision: Collision): void {
        const rb1: RigidBody = collision.coll1.parent.children.find((c) => c instanceof RigidBody) as RigidBody;
        const rb2: RigidBody = collision.coll2.parent.children.find((c) => c instanceof RigidBody) as RigidBody;

        if (rb1 != null && rb2 != null) {
            const m1: number = rb1.mass;
            const m2: number = rb2.mass;

            const v1: Vector2 = rb1.velocity.clone();
            const v2: Vector2 = rb2.velocity.clone();

            this.antiOverlap(collision, rb1, rb2);

            rb1.applyCollision(collision.contactAngle, m2, v2);
            rb2.applyCollision(collision.contactAngle, m1, v1);
        }
    }

    private antiOverlap(collision: Collision, rb1: RigidBody, rb2: RigidBody): void {
        const pos1: Vector2 = new Vector2(rb1.parent.position.clone().x, rb1.parent.position.clone().z);
        const pos2: Vector2 = new Vector2(rb2.parent.position.clone().x, rb2.parent.position.clone().z);
        const sign: number = Math.sign(pos2.clone().sub(pos1).dot(collision.normal));

        const antiOverlap1: Vector2 = collision.normal.clone().multiplyScalar(OVERLAP_FACTOR * sign * collision.overlap);
        const antiOverlap2: Vector2 = collision.normal.clone().multiplyScalar(-OVERLAP_FACTOR * sign * collision.overlap);
        rb1.parent.position.add(new Vector3(antiOverlap1.x, 0, antiOverlap1.y));
        rb2.parent.position.add(new Vector3(antiOverlap2.x, 0, antiOverlap2.y));
    }
}
