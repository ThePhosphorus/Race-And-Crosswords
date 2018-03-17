import { SpotLight, Vector3, Object3D } from "three";
import { FRONT_LIGHT_COLOR, FAR_LIGHT_DISTANCE, FRONT_LIGHT_PENUMBRA } from "./lights-constants";
const FRONT_LIGHT_POSITION: Vector3 = new Vector3(0, 1, -1);
const FRONT_LIGHT_TARGET: Vector3 = new Vector3(0, -0.1, -10);
export class CarLights extends Object3D {
    private frontLight: SpotLight;
    // private brakeLights: Array<SpotLight>;
    public constructor() {
        super();
        // this.brakeLights = new Array<SpotLight>();
        this.initFrontLight();
    }

    private initFrontLight(): void {
        this.frontLight = new SpotLight(FRONT_LIGHT_COLOR, 1, FAR_LIGHT_DISTANCE);
        this.frontLight.penumbra = FRONT_LIGHT_PENUMBRA;
        this.frontLight.position.copy(FRONT_LIGHT_POSITION);
        this.frontLight.target.position.copy(FRONT_LIGHT_TARGET);
        this.add(this.frontLight);
        this.add(this.frontLight.target);
    }
}
