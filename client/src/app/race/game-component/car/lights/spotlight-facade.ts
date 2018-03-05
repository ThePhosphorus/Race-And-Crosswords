import {SpotLight, Vector3} from "three";
export  class SpotLightFacade {
    private light: SpotLight;

    public constructor
    (
        color: string | number,
        intensity: number,
        distance: number,
        angle: number,
        height: number,
        private sideTranslation: number
    ) {
        this.light = new SpotLight(color, intensity, distance, angle);
        this.initHeight(height);
    }

    private initHeight(height: number): void {
        this.light.translateY(height);
    }

    public update(carPosition: Vector3, carDirection: Vector3): void {
        this.updatePosition(carPosition, carDirection);
        this.updateDirection(carDirection);

    }

    private updatePosition(carPosition: Vector3, carDirection: Vector3): void {
        this.setAtCar(carPosition);
        this.translateBack(carPosition, carDirection);
        this.translateSideways();
    }
    private updateDirection(carDirection: Vector3): void {

    }

    private setAtCar(carPosition: Vector3): void {
        this.light.position.copy(carPosition.clone());
    }

    private translateBack(carPosition: Vector3, carDirection: Vector3): void {
        this.light.position.copy((carPosition.clone().sub(carDirection.multiplyScalar(0.7))));
    }

    private translateSideways(): void {
        // this.light.position.
    }
}
