import { SpotLight, Vector3, Object3D } from "three";
import { RED } from "../../../../global-constants/constants";
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
    FRONT_LIGHT_INTENSITY
} from "./lights-constants";

export class CarLights extends Object3D {
    private frontLight: SpotLight;
    private brakeLights: Array<SpotLight>;
    public constructor() {
        super();
        this.brakeLights = new Array<SpotLight>();
        this.initFrontLight();
        this.initBrakeLights();
    }

    private initFrontLight(): void {
        this.frontLight = new SpotLight(FRONT_LIGHT_COLOR, 0, FAR_LIGHT_DISTANCE);
        this.frontLight.penumbra = FRONT_LIGHT_PENUMBRA;
        this.frontLight.position.copy(FRONT_LIGHT_POSITION);
        this.frontLight.target.position.copy(FRONT_LIGHT_TARGET);
        this.add(this.frontLight);
        this.add(this.frontLight.target);
    }

    private initBrakeLights(): void {
        this.initCenterLight();
        this.initSmallLight(EXT_LEFT_LIGHT_POSITION, EXT_LEFT_LIGHT_TARGET);
        this.initSmallLight(INT_LEFT_LIGHT_POSITION, INT_LEFT_LIGHT_TARGET);
        this.initSmallLight(INT_RIGHT_LIGHT_POSITION, INT_RIGHT_LIGHT_TARGET);
        this.initSmallLight(EXT_RIGHT_LIGHT_POSITION, EXT_RIGHT_LIGHT_TARGET);
    }

    private initSmallLight(position: Vector3, target: Vector3): void {
        const brakeLightLeft: SpotLight = new SpotLight(RED, 0, NEAR_LIGHT_DISTANCE, SMALL_LIGHT_ANGLE);
        brakeLightLeft.position.copy(position);
        brakeLightLeft.target.position.copy(target);
        this.add(brakeLightLeft);
        this.add(brakeLightLeft.target);
        this.brakeLights.push(brakeLightLeft);
    }
    private initCenterLight(): void {
        const brakeLightCenter: SpotLight = new SpotLight(RED, 0, FAR_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE);
        brakeLightCenter.penumbra = BACK_LIGHT_PENUMBRA;
        brakeLightCenter.position.copy(BACK_LIGHT_POSITION);
        brakeLightCenter.target.position.copy(BACK_LIGHT_TARGET);
        this.add(brakeLightCenter);
        this.add(brakeLightCenter.target);
        this.brakeLights.push(brakeLightCenter);
    }
    public toggleFrontLight(): void {
        this.frontLight.intensity = (this.frontLight.intensity === 0 ? FRONT_LIGHT_INTENSITY : 0);
    }

    public brake(): void {
        this.brakeLights.forEach((smallLight) => {
            if (smallLight !== this.brakeLights[0]) {
                smallLight.intensity = SMALL_LIGHT_INTENSITY;
            }});
        this.brakeLights[0].intensity = BACK_LIGHT_INTENSITY;
    }

    public releaseBrakes(): void {
        this.brakeLights.forEach((brakeLight) => { brakeLight.intensity = 0; });
    }
}
