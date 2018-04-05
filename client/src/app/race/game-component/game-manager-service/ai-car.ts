import { Car } from "../car/car";
import { AIController } from "../ai-controller/ai-controller";
import { Vector3 } from "three";

export class AICar {
    public constructor(public car: Car, public aiController: AIController) {}

    public async init(position: Vector3, color: string): Promise<void> {
        this.car.add(this.aiController);
        await this.car.init(position, color);
        this.aiController.init();
    }

    public update(deltaTime: number): void {
        this.aiController.update();
        this.car.update(deltaTime);
    }
}
