import { Collider } from "./collider";
import { Object3D, Vector2 } from "three";

const COLLIDER_WIDTH: number = 5;
const COLLIDER_LENGTH: number = 5;

/* tslint:disable: no-magic-numbers */
describe("Collisider", () => {
    it("should be created", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        expect(collider).toBeTruthy();
    });

    it("should have correct absolute vertexes", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        const object: Object3D = new Object3D();
        object.add(collider);
        const oldColliderVertexes: Vector2[] = collider.getAbsoluteVertexes2D();
        const objectMovement: Vector2 = new Vector2(100, 50);
        object.translateX(objectMovement.x);
        object.translateZ(objectMovement.y);
        const newColliderVertexes: Vector2[] = collider.getAbsoluteVertexes2D();

        for (let i: number = 0; i < oldColliderVertexes.length; i++) {
            const vertexMouvement: Vector2 = newColliderVertexes[i].clone().sub(oldColliderVertexes[i]);
            expect(vertexMouvement).toEqual(objectMovement);
        }

    });
    it("should have normals perpendicular to the sides", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        const object: Object3D = new Object3D();
        object.add(collider);
        const colliderVertexes: Vector2[] = collider.getAbsoluteVertexes2D();
        const colliderNormals: Vector2[] = collider.getNormals();

        for (let i: number = 0; i < colliderNormals.length; i++) {
            const vertex2: Vector2 = i < colliderVertexes.length - 1 ? colliderVertexes[i + 1] : colliderVertexes[0];
            const line: Vector2 = colliderVertexes[i].clone().sub(vertex2);

            const dotProduct: number = line.dot(colliderNormals[i]);

            expect(dotProduct).toEqual(0);
        }

    });

});
