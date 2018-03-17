import {SpotLight, Vector3} from "three";
const TARGET_OFFSET: number = 10;
const UP_VECTOR: Vector3 = new Vector3(0, 1, 0);
export class SpotLightManager {

    public constructor
    (
        private _light: SpotLight,
        private _height: number,
        private _sideTranslation: number,
        private _transversalTranslation: number,
        private _isFacingFront: boolean,
        private _intensity?: number
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
        this._light.target.position.copy((carPosition.clone()));
        if (this._isFacingFront) {
            this._light.target.position.add(carDirection.clone().multiplyScalar(TARGET_OFFSET));
        } else {
            this._light.target.position.sub(carDirection.clone().multiplyScalar(TARGET_OFFSET));
        }

        this._light.target.position.add(UP_VECTOR.clone().cross(carDirection).multiplyScalar(this._sideTranslation));
        this._light.target.updateMatrixWorld(true);
    }

    private setAtCar(carPosition: Vector3): void {
        this._light.position.copy(carPosition.clone());
    }

    private translateTransversal(carDirection: Vector3): void {
        if (this._transversalTranslation > 0) {
            this._light.position.add(carDirection.clone().multiplyScalar(this._transversalTranslation));
        } else {
            this._light.position.sub(carDirection.clone().multiplyScalar(Math.abs(this._transversalTranslation)));
        }

    }

    private translateSideways(carDirection: Vector3): void {
        if (this._sideTranslation !== 0) {
            this._light.position.add(UP_VECTOR.clone().cross(carDirection).multiplyScalar(this._sideTranslation));
        }
    }

    private addHeight(): void {
        const yTranslation: Vector3 = new Vector3(0, this._height, 0);
        this._light.position.add(yTranslation);
    }

    public get light(): SpotLight {
        return this._light;
    }

    public toggle(): void {
        this._light.intensity = (this.light.intensity === 0 ? 1 : 0);
    }

    public enable(): void {
        if (this._intensity !== undefined) {
            this.light.intensity = this._intensity;
        } else {
            this._light.intensity = 0;
        }
    }

    public disable(): void {
        this.light.intensity = 0;
    }
}
