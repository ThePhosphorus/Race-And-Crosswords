import { Collider } from "./collider";

const COLLIDER_WIDTH: number = 5;
const COLLIDER_LENGTH: number = 5;

describe("CollisionDetectorService", () => {
    it("should be created", () => {
        const collider: Collider = new Collider(COLLIDER_WIDTH, COLLIDER_LENGTH);
        expect(collider).toBeTruthy();
    });
});
