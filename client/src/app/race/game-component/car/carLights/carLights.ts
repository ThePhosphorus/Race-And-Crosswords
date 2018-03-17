import { SpotLight, Vector3, Object3D } from "three";
import { FRONT_LIGHT_COLOR, FAR_LIGHT_DISTANCE, FRONT_LIGHT_PENUMBRA, BACK_LIGHT_PENUMBRA, FRONT_LIGHT_ANGLE } from "./lights-constants";
import { RED } from "../../../../global-constants/constants";
const FRONT_LIGHT_POSITION: Vector3 = new Vector3(0, 0.8, -1.4);
const FRONT_LIGHT_TARGET: Vector3 = new Vector3(0, 0.8, -10);

const BACK_LIGHT_POSITION: Vector3 = new Vector3(0, 0.7, 1.4);
const BACK_LIGHT_TARGET: Vector3 = new Vector3(0, 0, 7);
export class CarLights extends Object3D {
    private frontLight: SpotLight;
    private brakeLights: Array<SpotLight>;
    // private brakeLights: Array<SpotLight>;
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
        const brakeLightCenter: SpotLight = new SpotLight(RED, 0.3, FAR_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE);
        brakeLightCenter.penumbra = BACK_LIGHT_PENUMBRA;
        brakeLightCenter.position.copy(BACK_LIGHT_POSITION);
        brakeLightCenter.target.position.copy(BACK_LIGHT_TARGET);
        this.add(brakeLightCenter);
        this.add(brakeLightCenter.target);
        this.brakeLights.push(brakeLightCenter);
    }

}
