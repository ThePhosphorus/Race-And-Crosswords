import { Injectable } from "@angular/core";
import { Scene, Vector2, Vector3, Object3D } from "three";
import { Collider } from "./colliders/collider";
import { BoxCollider } from "./colliders/box-collider";
import { LineCollider } from "./colliders/line-collider";
import { Projected } from "./projection";
import { Collision } from "./collision";
import { RigidBody } from "../rigid-body/rigid-body";
import { Car } from "../car/car";

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
        let contact: Vector2 = new Vector2();
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
                contact = new Vector2(normal.y, -normal.x);
                this.addCollisionIntersection(collision, projected1, projected2);
            }
        }
        collision.overlap = -minDistance;
        collision.contactAngle = contact.angle();

        return collision;
    }
    private addCollisionIntersection(collision: Collision, projected1: Projected, projected2: Projected): void {
        collision.collidingPoint1 = this.findIntersection(projected1, projected2);
        collision.collidingPoint2 = this.findIntersection(projected2, projected1);
    }

    private findIntersection(projected1: Projected, projected2: Projected): Vector2 {
        const maxProjectedDistance: number = projected2.minProjected - projected1.maxProjected;
        const minProjectedDistance: number = projected1.minProjected - projected2.maxProjected;

        const projected1Vertexes: Array<Vector2> =
            maxProjectedDistance > minProjectedDistance ? projected1.maxVertexes : projected1.minVertexes;
        const projected2Vertexes: Array<Vector2> =
            maxProjectedDistance > minProjectedDistance ? projected2.minVertexes : projected2.maxVertexes;

        if (projected1Vertexes.length === 1) {
            return projected1Vertexes[0];
        } else {
            if (projected2Vertexes.length === 1) {
                return this.projectPoint(projected2Vertexes[0], projected1Vertexes);
            } else {
                return this.projectPoint(projected2Vertexes[0], projected1Vertexes);
            }
        }
    }

    private projectPoint(point: Vector2, line: Array<Vector2>): Vector2 {
        const axis: Vector2 = line[0].sub(line[1]).normalize();
        const projection: number = point.dot(axis);

        return line[0].add(axis.multiplyScalar(projection));
    }

    private resolveCollision(collision: Collision): void {
        const rb1: RigidBody = collision.coll1.parent.children.find((c) => c instanceof RigidBody) as RigidBody;
        const rb2: RigidBody = collision.coll2.parent.children.find((c) => c instanceof RigidBody) as RigidBody;

        if (rb1 != null && rb2 != null) {
            const m1: number = rb1.mass;
            const m2: number = rb2.mass;

            const v1: Vector2 = rb1.velocity.clone();
            const v2: Vector2 = rb2.velocity.clone();

            const antiOverlap1: Vector2 = rb1.velocity.clone().normalize().multiplyScalar(collision.overlap / 2);
            const antiOverlap2: Vector2 = rb2.velocity.clone().normalize().multiplyScalar(collision.overlap / 2);
            rb1.parent.position.add(new Vector3(antiOverlap1.x, 0, antiOverlap1.y));
            rb2.parent.position.add(new Vector3(antiOverlap2.x, 0, antiOverlap2.y));

            rb1.applyCollision(collision.contactAngle, m2, v2);
            rb2.applyCollision(collision.contactAngle, m1, v1);
            this.collisionSound(rb1);
            this.collisionSound(rb2);
        }
    }

    private collisionSound(obj: Object3D): void {
        obj.traverseAncestors((parent) => {
            if (parent instanceof Car) {
                parent.collisionSound();
            }
        });
    }
}
