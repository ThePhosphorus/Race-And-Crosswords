import { Car } from "../car/car";
import { AIController } from "../ai-controller/ai-controller";
import { Vector3 } from "three";

export class AICar {
    public constructor(public car: Car, public aiController: AIController) {}

    public async init(position: Vector3, color: string, track: Array<Vector3>): Promise<void> {
        this.car.add(this.aiController);
        await this.car.init(position, color);
        this.aiController.init(track);
    }

    public update(deltaTime: number): void {
        this.aiController.update();
        this.car.update(deltaTime);
    }
}
