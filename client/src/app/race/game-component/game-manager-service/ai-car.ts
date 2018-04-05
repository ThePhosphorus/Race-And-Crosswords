import { Car } from "../car/car";
import { AIController } from "../ai-controller/ai-controller";
import { Vector3 } from "three";
import { Track } from "../../../../../../common/race/track";

export class AICar {
    public constructor(public car: Car, public aiController: AIController) {}

    public async init(position: Vector3, color: string, track: Track): Promise<void> {
        this.car.add(this.aiController);
        await this.car.init(position, color);
        this.aiController.init(track);
    }

    public update(deltaTime: number): void {
        this.aiController.update();
        this.car.update(deltaTime);
    }
}
