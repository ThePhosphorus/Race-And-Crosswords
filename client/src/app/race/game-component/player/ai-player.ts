import { RacePlayer } from "./player";
import { AIController } from "../ai-controller/ai-controller";
import { Car } from "../car/car";
import { Vector3 } from "three";

export class AiPlayer extends RacePlayer {
    private aiController: AIController;
    private track: Array<Vector3>;

    public constructor(car: Car, track: Array<Vector3>) {
        super(car);
        this.aiController = new AIController();
        this.track = track;
    }

    public async init(position: Vector3, color: string): Promise<void> {
        this.car.add(this.aiController);
        await this.car.init(position, color);
        this.aiController.init(this.track);
    }

    public update(deltaTime: number): void {
        this.aiController.update(deltaTime);
        this.car.update(deltaTime);
    }
}
