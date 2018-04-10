import { SpotLight, Vector3, Object3D, Color } from "three";
import { RED, WHITE } from "../../../../global-constants/constants";
import {
    FRONT_LIGHT_COLOR,
    FAR_LIGHT_DISTANCE,
    FRONT_LIGHT_PENUMBRA,
    NEAR_LIGHT_DISTANCE,
    SMALL_LIGHT_ANGLE,
    FRONT_LIGHT_ANGLE,
    BACK_LIGHT_PENUMBRA,
    BACK_LIGHT_INTENSITY,
    SMALL_LIGHT_INTENSITY,
    EXT_LEFT_LIGHT_POSITION,
    EXT_LEFT_LIGHT_TARGET,
    INT_LEFT_LIGHT_POSITION,
    INT_LEFT_LIGHT_TARGET,
    INT_RIGHT_LIGHT_POSITION,
    INT_RIGHT_LIGHT_TARGET,
    EXT_RIGHT_LIGHT_TARGET,
    EXT_RIGHT_LIGHT_POSITION,
    BACK_LIGHT_POSITION,
    BACK_LIGHT_TARGET,
    FRONT_LIGHT_TARGET,
    FRONT_LIGHT_POSITION,
    FRONT_LIGHT_INTENSITY,
    POSITION_OFFSET,
    TARGET_OFFSET
} from "./lights-constants";

export class CarLights extends Object3D {
    private _frontLight: SpotLight;
    private _brakeLights: Array<SpotLight>;

    public constructor(isAiCar: boolean) {
        super();
        this._brakeLights = new Array<SpotLight>();
        this.initFrontLight();
        this.initBrakeLights(isAiCar);
    }

    private initFrontLight(): void {
        this._frontLight = new SpotLight(FRONT_LIGHT_COLOR, 0, FAR_LIGHT_DISTANCE);
        this._frontLight.penumbra = FRONT_LIGHT_PENUMBRA;
        this._frontLight.position.copy(FRONT_LIGHT_POSITION);
        this._frontLight.target.position.copy(FRONT_LIGHT_TARGET);
        this.add(this._frontLight);
        this.add(this._frontLight.target);
    }

    private initBrakeLights(isAiCar: boolean): void {
        this.initCenterLight();
        if (!isAiCar) {
            this.initSmallLight(EXT_LEFT_LIGHT_POSITION, EXT_LEFT_LIGHT_TARGET);
            this.initSmallLight(INT_LEFT_LIGHT_POSITION, INT_LEFT_LIGHT_TARGET);
            this.initSmallLight(INT_RIGHT_LIGHT_POSITION, INT_RIGHT_LIGHT_TARGET);
            this.initSmallLight(EXT_RIGHT_LIGHT_POSITION.clone().add(POSITION_OFFSET), EXT_RIGHT_LIGHT_TARGET.clone().sub(TARGET_OFFSET));
        }
    }

    private initSmallLight(position: Vector3, target: Vector3): void {
        const brakeLightLeft: SpotLight = new SpotLight(RED, 0, NEAR_LIGHT_DISTANCE, SMALL_LIGHT_ANGLE);
        brakeLightLeft.castShadow = false;
        brakeLightLeft.position.copy(position);
        brakeLightLeft.target.position.copy(target);
        this.add(brakeLightLeft);
        this.add(brakeLightLeft.target);
        this._brakeLights.push(brakeLightLeft);
    }
    private initCenterLight(): void {
        const brakeLightCenter: SpotLight = new SpotLight(RED, 0, FAR_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE);
        brakeLightCenter.penumbra = BACK_LIGHT_PENUMBRA;
        brakeLightCenter.position.copy(BACK_LIGHT_POSITION);
        brakeLightCenter.target.position.copy(BACK_LIGHT_TARGET);
        this.add(brakeLightCenter);
        this.add(brakeLightCenter.target);
        this._brakeLights.push(brakeLightCenter);
    }
    public toggleFrontLight(): void {
        this._frontLight.intensity = (this._frontLight.intensity === 0 ? FRONT_LIGHT_INTENSITY : 0);
    }

    public brake(): void {
        this._brakeLights.forEach((smallLight) => {
            if (smallLight !== this._brakeLights[0]) {
                smallLight.intensity = SMALL_LIGHT_INTENSITY;
            }});
        this._brakeLights[0].intensity = BACK_LIGHT_INTENSITY;
    }

    public releaseBrakes(): void {
        this._brakeLights.forEach((brakeLight) => { brakeLight.intensity = 0; });
    }

    public reverse(): void {
        this._brakeLights.forEach((smallLight) => {
            if (smallLight !== this._brakeLights[0]) {
                smallLight.color = new Color(WHITE);
                smallLight.intensity = SMALL_LIGHT_INTENSITY;
            }});
        this._brakeLights[0].intensity = 0;
    }

    public releaseReverse(): void {
        this._brakeLights.forEach((smallLight) => {
            if (smallLight !== this._brakeLights[0]) {
                smallLight.color = new Color(RED);
                smallLight.intensity = 0;
            }});
        this._brakeLights[0].intensity = 0;
    }
}
