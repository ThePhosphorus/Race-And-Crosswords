import { Vector3 } from "three";
import { DEFAULT_TRACK_WIDTH } from "../../../race.constants";

const INITIAL_SPAWN_OFFSET: number = 7;
const SPACE_BETWEEN_CARS: number = 5;
const OFFSET_FACTOR: number = 0.25;

export class SpawnPoint {
    public constructor(public position: Vector3, public direction: Vector3) {}
}

export class SpawnPointFinder {
    public static findSpawnPoints(track: Array<Vector3>, spawnPlaces: number): Array<SpawnPoint> {
        const spawnPoints: Array<SpawnPoint> = new Array<SpawnPoint>();
        const spawnDirection: Vector3 = SpawnPointFinder.calculateSpawnDirection(track);
        const perpOffset: Vector3 = this.calculateOffset(spawnDirection);
        const lookAtOffset: Vector3 = spawnDirection.clone().multiplyScalar(INITIAL_SPAWN_OFFSET);

        let offset: number = 0;
        for (let i: number = 0; i < spawnPlaces; i++) {
            offset = i % 2 === 0 ? offset + 1 : offset;
            const position: Vector3 = track[0].clone()
                .add(spawnDirection.clone().multiplyScalar((offset * SPACE_BETWEEN_CARS) + INITIAL_SPAWN_OFFSET))
                .add(perpOffset.clone().multiplyScalar(-Math.pow(-1, i)));
            const direction: Vector3 = position.clone().add(lookAtOffset);
            spawnPoints.push(new SpawnPoint(position, direction));
        }

        return spawnPoints.sort(() => Math.random() - 1 / 2);
    }

    private static calculateOffset(spawnDirection: Vector3): Vector3 {
        return new Vector3(spawnDirection.z, spawnDirection.y, -spawnDirection.x)
            .multiplyScalar(-DEFAULT_TRACK_WIDTH * OFFSET_FACTOR);
    }

    private static calculateSpawnDirection(track: Array<Vector3>): Vector3 {
        return track[track.length - 2].clone().sub(track[track.length - 1]).normalize();
    }
}
