import {SpotLight, Vector3} from "three";
const TARGET_OFFSET: number = 10;
export  class SpotLightFacade {
    private _light: SpotLight;

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
        this._light = new SpotLight(color, intensity, distance, angle);
        this._light.penumbra = penumbra;
        this.initHeight(height);
    }

    private initHeight(height: number): void {
        const yTranslation: Vector3 = new Vector3(0, height, 0);
        this._light.position.add(yTranslation);
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
        this._light.target.position.copy((carPosition.clone().add(carDirection.multiplyScalar(TARGET_OFFSET))));
        this._light.target.updateMatrixWorld(true);
    }

    private setAtCar(carPosition: Vector3): void {
        this._light.position.copy(carPosition.clone());
    }

    private translateTransversal(carPosition: Vector3, carDirection: Vector3): void {
        this._light.position.add(carDirection.multiplyScalar(this.transversalTranslation));
    }

    private translateSideways(carDirection: Vector3): void {
        this._light.position.add(this._light.up.clone().cross(carDirection).multiplyScalar(this.sideTranslation));
    }

    public get light(): SpotLight {
        return this._light;
    }

}