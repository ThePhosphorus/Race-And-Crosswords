import {SpotLight, Vector3} from "three";
const TARGET_OFFSET: number = 10;
const UP_VECTOR: Vector3 = new Vector3(0, 1, 0);
export  class SpotLightFacade {
    private _light: SpotLight;

    public constructor
    (
        private isFacingFront: boolean,
        color: string | number,
        private intensity: number,
        distance: number,
        private height: number,
        private sideTranslation: number,
        private transversalTranslation: number,
        penumbra: number,
        angle?: number
    ) {
        this._light = new SpotLight(color, 0, distance, angle);
        this._light.penumbra = penumbra;
    }



    public update(carPosition: Vector3, carDirection: Vector3): void {
        this.updatePosition(carPosition, carDirection);
        this.updateDirection(carPosition, carDirection);

    }

    private updatePosition(carPosition: Vector3, carDirection: Vector3): void {
        this.setAtCar(carPosition);
        this.translateTransversal(carDirection);
        this.translateSideways(carDirection);
        this.addHeight();
    }
    private updateDirection(carPosition: Vector3, carDirection: Vector3): void {
        this.isFacingFront ?
        this._light.target.position.copy((carPosition.clone().add(carDirection.clone().multiplyScalar(TARGET_OFFSET))))
        :
        this._light.target.position.copy((carPosition.clone().sub(carDirection.clone().multiplyScalar(TARGET_OFFSET))));
        this._light.target.updateMatrixWorld(true);
    }

    private setAtCar(carPosition: Vector3): void {
        this._light.position.copy(carPosition.clone());
    }

    private translateTransversal(carDirection: Vector3): void {
        this._light.position.add(carDirection.multiplyScalar(this.transversalTranslation));
    }

    private translateSideways(carDirection: Vector3): void {
        if (this.sideTranslation !== 0) {
            this._light.position.add(UP_VECTOR.clone().cross(carDirection.clone()).multiplyScalar(this.sideTranslation));
        }
    }

    private addHeight(): void {
        const yTranslation: Vector3 = new Vector3(0, this.height, 0);
        this._light.position.add(yTranslation);
    }

    public get light(): SpotLight {
        return this._light;
    }

    public disable(): void {
        this.light.intensity = 0;
    }

    public enable(): void {
        this.light.intensity = this.intensity;
    }
}
