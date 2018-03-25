import { Collider } from "./collider";
import { Object3D, Vector2 } from "three";

const COLLIDER_WIDTH: number = 5;
const COLLIDER_LENGTH: number = 5;

/* tslint:disable: no-magic-numbers */
describe("Collider", () => {
    it("should be created", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        expect(collider).toBeTruthy();
    });

    it("should have correct absolute vertices", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        const object: Object3D = new Object3D();
        object.add(collider);
        const oldColliderVertices: Vector2[] = collider.getAbsoluteVertices2D();
        const objectMovement: Vector2 = new Vector2(100, 50);
        object.translateX(objectMovement.x);
        object.translateZ(objectMovement.y);
        object.updateMatrixWorld(true);
        const newColliderVertices: Vector2[] = collider.getAbsoluteVertices2D();

        for (let i: number = 0; i < oldColliderVertices.length; i++) {
            const vertexMouvement: Vector2 = newColliderVertices[i].clone().sub(oldColliderVertices[i]);
            expect(newColliderVertices[i] !== oldColliderVertices[i]).toBeTruthy();
            expect(vertexMouvement).toEqual(objectMovement);
        }

    });

    it("should have normals perpendicular to the sides", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        const object: Object3D = new Object3D();
        object.add(collider);
        const colliderVertices: Vector2[] = collider.getAbsoluteVertices2D();
        const colliderNormals: Vector2[] = collider.getNormals();

        for (let i: number = 0; i < colliderNormals.length; i++) {
            const vertex2: Vector2 = i < colliderVertices.length - 1 ? colliderVertices[i + 1] : colliderVertices[0];
            const line: Vector2 = colliderVertices[i].clone().sub(vertex2);

            const dotProduct: number = Math.abs(line.dot(colliderNormals[i]));

            expect(dotProduct).toEqual(0);
        }

    });
});
