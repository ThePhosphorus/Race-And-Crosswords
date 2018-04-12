import { Vector3 } from "three";
import { SpawnPointFinder, SpawnPoint } from "./spawn-point";

describe("SpawnPointFinder", () => {

    const track: Array<Vector3> = new Array<Vector3>();

    // tslint:disable:no-magic-numbers
    beforeAll(() => {
        track.push(new Vector3(0, 0, 0));
        track.push(new Vector3(100, 0, 0));
        track.push(new Vector3(100, 0, 100));
        track.push(new Vector3(-100, 0, 100));
        track.push(new Vector3(-100, 0, 0));
        track.push(new Vector3(0, 0, 0));
    });

    it("should create spawn positions", () => {
        const spawnPlaces: number = 4;
        const positions: Array<SpawnPoint> = SpawnPointFinder.findSpawnPoints(track, spawnPlaces);

        expect(positions).toBeDefined();
        expect(positions.length).toBe(spawnPlaces);
    });

    it("should have random positions", () => {
        const spawnPlaces: number = 4;
        const testCases: number = 3;
        const positions: Array<Array<SpawnPoint>> = new Array<Array<SpawnPoint>>();
        let hasRandomPosition: boolean = false;

        for (let j: number = 0; j < testCases; j++) {
            positions.push(SpawnPointFinder.findSpawnPoints(track, spawnPlaces));
        }

        for (let i: number = 0; i < positions[0].length; i++) {
            const tmpPosition: Vector3 = positions[0][i].position;
            for (const point of positions) {
                hasRandomPosition = hasRandomPosition || !point[i].position.equals(tmpPosition);
                if (hasRandomPosition) {
                    break;
                }
            }
        }

        expect(hasRandomPosition).toBeTruthy();
    });
});
