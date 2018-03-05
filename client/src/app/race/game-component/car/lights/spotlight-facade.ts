import {SpotLight, Vector3} from "three";
const TARGET_OFFSET: number = 10;
export  class SpotLightFacade {
    private light: SpotLight;

    public constructor
    (
        color: string | number,
        intensity: number,
        distance: number,
        height: number,
        private sideTranslation: number,
        private transversalTranslation: number,
        penumbra: number,
        angle?: number
    ) {
        this.light = new SpotLight(color, intensity, distance, angle);
        this.light.penumbra = penumbra;
        this.light.angle = angle;
        this.initHeight(height);
    }

    private initHeight(height: number): void {
        this.light.translateY(height);
    }

    public update(carPosition: Vector3, carDirection: Vector3): void {
        this.updatePosition(carPosition, carDirection);
        this.updateDirection(carPosition, carDirection);

    }

    private updatePosition(carPosition: Vector3, carDirection: Vector3): void {
        this.setAtCar(carPosition);
        this.translateTransversal(carPosition, carDirection);
        this.translateSideways(carDirection);
    }
    private updateDirection(carPosition: Vector3, carDirection: Vector3): void {
        this.light.target.position.copy((carPosition.clone().add(carDirection.multiplyScalar(TARGET_OFFSET))));
        this.light.target.updateMatrixWorld(true);
    }

    private setAtCar(carPosition: Vector3): void {
        this.light.position.copy(carPosition.clone());
    }

    private translateTransversal(carPosition: Vector3, carDirection: Vector3): void {
        this.light.position.add(carDirection.multiplyScalar(this.transversalTranslation));
    }

    private translateSideways(carDirection: Vector3): void {
        this.light.position.add(this.light.up.clone().cross(carDirection).multiplyScalar(this.sideTranslation));
    }
}
