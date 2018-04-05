import { Injectable } from "@angular/core";
import { Scene, AmbientLight, DirectionalLight, CubeTextureLoader, Vector3 } from "three";
import { Car } from "../car/car";
import {
    HALF,
    WHITE,
    AMBIENT_NIGHT_LIGHT_OPACITY,
    SUNSET, AMBIENT_LIGHT_OPACITY,
    SHADOW_CAMERA_PLANE_RATIO,
    QUARTER,
    SHADOWMAP_SIZE
} from "../../../global-constants/constants";

const DIRECTIONAL_LIGHT_OFFSET: number = 50;
const NIGHT_BACKGROUND_PATH: string = "../../assets/skybox/sky3/";
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";
const SUNLIGHT_INTENSITY: number = 0.2;
const D_LIGHT_PLANE_SIZE: number = 200;
const SHADOW_BIAS: number = 0.0001;

@Injectable()
export class LightManagerService {
    private _isShadowMode: boolean;
    private _isNightMode: boolean;
    private _directionalLight: DirectionalLight;
    private _dayAmbientLight: AmbientLight;
    private _nightAmbientLight: AmbientLight;
    private _scene: Scene;
    private _player: Car;
    private _aiControlledCars: Array<Car>;
    public constructor() {
            this._dayAmbientLight = new AmbientLight(SUNSET, AMBIENT_LIGHT_OPACITY);
            this._nightAmbientLight = new AmbientLight(WHITE, AMBIENT_NIGHT_LIGHT_OPACITY);
            this._isNightMode = false;
            this._isShadowMode = false;
         }
    public init(scene: Scene, player: Car, aiControlledCars: Array<Car>): void {
        this._scene = scene;
        this._player = player;
        this._aiControlledCars = aiControlledCars;
        this._scene.add(this._dayAmbientLight);
        this.loadSkybox(BACKGROUND_PATH);
        this.loadSunlight();
    }
    public  updateSunlight(): void {
        const sunlightoffSet: Vector3 = new Vector3(0, DIRECTIONAL_LIGHT_OFFSET, -DIRECTIONAL_LIGHT_OFFSET * HALF);
        this._directionalLight.target = this._player.mesh;
        this._directionalLight.position.copy((this._player.getPosition().clone().add(sunlightoffSet)));
    }

    public toggleSunlight(): void {
        if (this._scene.children.find( (x) => x.id === this._directionalLight.id) !== undefined) {
            this._scene.remove(this._directionalLight);
            this._isShadowMode = false;
        } else if (!this._isNightMode) {
            this._scene.add(this._directionalLight);
            this._isShadowMode = true;
        }
    }

    public loadSkybox(path: string): void {
        // this._scene.background = new CubeTextureLoader()
        //     .setPath(path)
        //     .load([
        //         "posx.png",
        //         "negx.png",
        //         "posy.png",
        //         "negy.png",
        //         "posz.png",
        //         "negz.png"
        //     ]);
    }
    public toggleNightMode(): void {

        this._player.toggleNightLight();
        this._aiControlledCars.forEach((aiCar) => {
            aiCar.toggleNightLight();
        });
        if (this._isNightMode) {
            this._scene.remove(this._nightAmbientLight);
            this._scene.add(this._dayAmbientLight);
            this.loadSkybox(BACKGROUND_PATH);
            this._isNightMode = false;
            if (this._isShadowMode) {
                this._scene.add(this._directionalLight);
            }
        } else {
            this._scene.remove(this._dayAmbientLight);
            this._scene.add(this._nightAmbientLight);
            this.loadSkybox(NIGHT_BACKGROUND_PATH);
            this._isNightMode = true;
            if (this._isShadowMode) {
                this._scene.remove(this._directionalLight);
            }
        }
    }

    private loadSunlight(): void {
        this._directionalLight = new DirectionalLight(SUNSET, SUNLIGHT_INTENSITY);
        this._directionalLight.castShadow = true;
        this._directionalLight.shadow.camera.bottom = -D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.top = D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.left = -D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.right = D_LIGHT_PLANE_SIZE * QUARTER;
        this._directionalLight.shadow.camera.near = D_LIGHT_PLANE_SIZE * SHADOW_CAMERA_PLANE_RATIO;
        this._directionalLight.shadow.camera.far = D_LIGHT_PLANE_SIZE;
        this._directionalLight.shadow.mapSize.x = SHADOWMAP_SIZE;
        this._directionalLight.shadow.mapSize.y = SHADOWMAP_SIZE;
        this._directionalLight.shadowBias = SHADOW_BIAS;
    }

}
