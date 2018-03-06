import {SpotLight, Vector3} from "three";
const TARGET_OFFSET: number = 10;
const UP_VECTOR: Vector3 = new Vector3(0, 1, 0);
export  class SpotLightFacade {

    public constructor
    (
        private _light: SpotLight,
        private height: number,
        private sideTranslation: number,
        private transversalTranslation: number,
        private isFacingFront: boolean,
        private intensity?: number
    ) {}

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
        if (this.transversalTranslation > 0) {
            this._light.position.add(carDirection.clone().multiplyScalar(this.transversalTranslation));
        } else {
            this._light.position.sub(carDirection.clone().multiplyScalar(Math.abs(this.transversalTranslation)));
        }

    }

    private translateSideways(carDirection: Vector3): void {
        if (this.sideTranslation !== 0) {
            this._light.position.add(UP_VECTOR.clone().cross(carDirection).multiplyScalar(this.sideTranslation));
        }
    }

    private addHeight(): void {
        const yTranslation: Vector3 = new Vector3(0, this.height, 0);
        this._light.position.add(yTranslation);
    }

    public get light(): SpotLight {
        return this._light;
    }

    public toggle(): void {
        this._light.intensity = (this.light.intensity === 0 ? 1 : 0);
    }

    public enable(): void {
        if (this.intensity !== undefined) {
            this.light.intensity = this.intensity;
        } else {
            this._light.intensity = 1;
        }
    }

    public disable(): void {
        this.light.intensity = 0;
    }
}
