import { Injectable } from "@angular/core";
import { Scene, Vector2, Vector3 } from "three";
import { Collider } from "./collider";
import { Projected } from "./projection";
import { Collision } from "./collision";
import { RigidBody } from "../rigid-body/rigid-body";
const OVERLAP_FACTOR: number = 0.5;
const COLLIDER_UPDATE_TIMELAPSE: number = 300;

@Injectable()
export class CollisionDetectorService {

    private colliders: Array<Collider>;
    private colliderCount: number; // used to update colliders at each 60 frames
    public constructor() {
        this.colliderCount = 0;
        this.colliders = null;
     }

    public detectCollisions(scene: Scene): void {
        const colliders: Array<Collider> = this.getColliders(scene);
        for (let i: number = 0; i < colliders.length; i++) {
            for (let j: number = i + 1; j < colliders.length; j++) {
                const rb1: RigidBody = colliders[i].rigidBody;
                const rb2: RigidBody = colliders[j].rigidBody;
                if (rb1 != null && rb2 != null && (!rb1.fixed || !rb2.fixed) && this.broadDetection(colliders[i], colliders[j])) {
                    const collision: Collision = this.boxBoxDetection(colliders[i], colliders[j]);
                    if (collision != null) {
                        this.resolveCollision(collision);
                    }
                }
            }
        }
    }

    private getColliders(scene: Scene): Array<Collider> {
        if (this.colliderCount === 0 || this.colliders == null) {
            console.log("Update");

            this.colliders = new Array<Collider>();
            scene.traverse((obj) => {
                if (obj instanceof Collider) {
                    this.colliders.push(obj);
                }
            });
        }
        this.colliderCount = ( this.colliderCount + 1 ) % COLLIDER_UPDATE_TIMELAPSE;

        return this.colliders;
    }

    private broadDetection(coll1: Collider, coll2: Collider): boolean {
        return coll2.getAbsolutePosition().clone().sub(
            coll1.getAbsolutePosition()).length() <= (coll1.getBroadRadius() + coll2.getBroadRadius());
    }

    private boxBoxDetection(coll1: Collider, coll2: Collider): Collision {
        const vertices1: Array<Vector2> = coll1.getAbsoluteVertices2D();
        const vertices: Array<Vector2> = coll2.getAbsoluteVertices2D();
        const axises: Array<Vector2> = coll1.getNormals().concat(coll2.getNormals());
        let minDistance: number = Number.MAX_VALUE;
        let distanceNormal: Vector2 = new Vector2();

        for (const normal of axises) {
            const projected1: Projected = new Projected(vertices1, normal.clone());
            const projected2: Projected = new Projected(vertices, normal.clone());
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
        const rb1: RigidBody = collision.coll1.rigidBody;
        const rb2: RigidBody = collision.coll2.rigidBody;

        if (rb1 != null && rb2 != null) {
            this.antiOverlap(collision, rb1, rb2);

            const initialVelocity1: Vector2 = rb1.velocity.clone();
            const initialVelocity2: Vector2 = rb2.velocity.clone();

            rb1.applyCollision(collision.contactAngle, rb2, initialVelocity2);
            rb2.applyCollision(collision.contactAngle, rb1, initialVelocity1);
        }
    }

    private antiOverlap(collision: Collision, rb1: RigidBody, rb2: RigidBody): void {
        const pos1: Vector2 = new Vector2(rb1.parent.position.clone().x, rb1.parent.position.clone().z);
        const pos2: Vector2 = new Vector2(rb2.parent.position.clone().x, rb2.parent.position.clone().z);
        const sign: number = Math.sign(pos2.clone().sub(pos1).dot(collision.normal));

        const antiOverlap1: Vector2 = rb1.fixed ? new Vector2(0, 0) :
            collision.normal.clone().multiplyScalar(OVERLAP_FACTOR * sign * collision.overlap);
        const antiOverlap2: Vector2 = rb2.fixed ? new Vector2(0, 0) :
            collision.normal.clone().multiplyScalar(-OVERLAP_FACTOR * sign * collision.overlap);
        rb1.parent.position.add(new Vector3(antiOverlap1.x, 0, antiOverlap1.y));
        rb2.parent.position.add(new Vector3(antiOverlap2.x, 0, antiOverlap2.y));
    }
}
