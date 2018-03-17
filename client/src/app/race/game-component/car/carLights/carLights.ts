import { SpotLight, Vector3, Object3D } from "three";
import { FRONT_LIGHT_COLOR, FAR_LIGHT_DISTANCE, FRONT_LIGHT_PENUMBRA, BACK_LIGHT_PENUMBRA, FRONT_LIGHT_ANGLE, NEAR_LIGHT_DISTANCE, SMALL_LIGHT_ANGLE } from "./lights-constants";
import { RED } from "../../../../global-constants/constants";
const FRONT_LIGHT_POSITION: Vector3 = new Vector3(0, 0.8, -1.4);
const FRONT_LIGHT_TARGET: Vector3 = new Vector3(0, 0.8, -10);

const BACK_LIGHT_POSITION: Vector3 = new Vector3(0, 0.7, 1.4);
const BACK_LIGHT_TARGET: Vector3 = new Vector3(0, 0, 7);

const EXT_LEFT_LIGHT_POSITION: Vector3 = new Vector3(-0.47, 0.6, 2);
const EXT_LEFT_LIGHT_TARGET: Vector3 = new Vector3(0.5, 0.8, -10 );

const INT_LEFT_LIGHT_POSITION: Vector3 = new Vector3(-0.29, 0.6, 2);
const INT_LEFT_LIGHT_TARGET: Vector3 = new Vector3(0.25, 0.8, -10 );

const INT_RIGHT_LIGHT_POSITION: Vector3 = new Vector3(0.27, 0.6, 2);
const INT_RIGHT_LIGHT_TARGET: Vector3 = new Vector3(0.25, 0.8, -10 );

const EXT_RIGHT_LIGHT_POSITION: Vector3 = new Vector3(0.44, 0.6, 2);
const EXT_RIGHT_LIGHT_TARGET: Vector3 = new Vector3(0.5, 0.8, -10 );



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
        this.frontLight = new SpotLight(FRONT_LIGHT_COLOR, 1, FAR_LIGHT_DISTANCE);
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
        const brakeLightLeft: SpotLight = new SpotLight(RED, 10, NEAR_LIGHT_DISTANCE, SMALL_LIGHT_ANGLE);
        brakeLightLeft.position.copy(position);
        brakeLightLeft.target.position.copy(target);
        this.add(brakeLightLeft);
        this.add(brakeLightLeft.target);
        this.brakeLights.push(brakeLightLeft);
    }
    private initCenterLight(): void {
        const brakeLightCenter: SpotLight = new SpotLight(RED, 0.3, FAR_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE);
        brakeLightCenter.penumbra = BACK_LIGHT_PENUMBRA;
        brakeLightCenter.position.copy(BACK_LIGHT_POSITION);
        brakeLightCenter.target.position.copy(BACK_LIGHT_TARGET);
        this.add(brakeLightCenter);
        this.add(brakeLightCenter.target);
        this.brakeLights.push(brakeLightCenter);
    }
}
