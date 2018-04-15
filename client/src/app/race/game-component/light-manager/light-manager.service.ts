import { Injectable } from "@angular/core";
import { Scene, AmbientLight, DirectionalLight, Vector3 } from "three";
import { Car } from "../car/car";
import { LoaderService } from "../loader-service/loader.service";
import {
    HALF,
    WHITE,
    AMBIENT_NIGHT_LIGHT_OPACITY,
    SUNSET, AMBIENT_LIGHT_OPACITY,
    SHADOW_CAMERA_PLANE_RATIO,
    QUARTER,
    SHADOWMAP_SIZE
} from "../../../global-constants/constants";
import { LoadedCubeTexture } from "../loader-service/load-types.enum";

const DIRECTIONAL_LIGHT_OFFSET: number = 50;
const SUNLIGHT_INTENSITY: number = 0.2;
const D_LIGHT_PLANE_SIZE: number = 200;
const SHADOW_BIAS: number = 0.0001;
const DAY_AMBIENT_LIGHT: AmbientLight = new AmbientLight(SUNSET, AMBIENT_LIGHT_OPACITY);
const NIGHT_AMBIENT_LIGHT: AmbientLight = new AmbientLight(WHITE, AMBIENT_NIGHT_LIGHT_OPACITY);

@Injectable()
export class LightManagerService {
    private _isFancyMode: boolean;
    private _isNightMode: boolean;
    private _directionalLight: DirectionalLight;
    private _scene: Scene;
    private _player: Car;
    private _aiControlledCars: Array<Car>;
    public constructor(private loader: LoaderService) {
            this._isNightMode = false;
            this._isFancyMode = false;
         }

    public init(scene: Scene, player: Car, aiControlledCars: Array<Car>): void {
        this._scene = scene;
        this._player = player;
        this._aiControlledCars = aiControlledCars;
        this._scene.add(DAY_AMBIENT_LIGHT);
        this.loadSkybox(LoadedCubeTexture.daySkyBox);
        this.loadSunlight();
    }
    public  updateSunlight(): void {
        const sunlightoffSet: Vector3 = new Vector3(0, DIRECTIONAL_LIGHT_OFFSET, -DIRECTIONAL_LIGHT_OFFSET * HALF);
        this._directionalLight.target = this._player.mesh;
        this._directionalLight.position.copy((this._player.getPosition().clone().add(sunlightoffSet)));
    }

    public toggleFancyMode(): void {
        if (this._isNightMode) {
            this._player.toggleNightLightShadows();
            this._aiControlledCars.forEach((aiCar) => {
            aiCar.toggleNightLightShadows();
        });
        } else {
            this.toggleSunShadows();
        }
    }

    private toggleSunShadows(): void {
        if (this._scene.children.find( (x) => x.id === this._directionalLight.id) !== undefined) {
            this._scene.remove(this._directionalLight);
        } else if (!this._isNightMode) {
            this._scene.add(this._directionalLight);
        }
        this._isFancyMode = !this._isFancyMode;
    }

    public loadSkybox(type: LoadedCubeTexture): void {
        this._scene.background = this.loader.getCubeTexture(type);
    }

    public toggleNightShadows(): void {
        if (this._isNightMode) {
            this._player.toggleNightLightShadows();
            this._aiControlledCars.forEach((aiCar) => {
                aiCar.toggleNightLightShadows();
            });
        }
    }

    public toggleNightMode(): void {
        this._player.toggleNightLight();
        this._aiControlledCars.forEach((aiCar) => {
            aiCar.toggleNightLight();
        });
        if (this._isNightMode) {
            this._scene.remove(NIGHT_AMBIENT_LIGHT);
            this._scene.add(DAY_AMBIENT_LIGHT);
            this.loadSkybox(LoadedCubeTexture.daySkyBox);
            if (this._isFancyMode) {
                this._scene.add(this._directionalLight);
            }
            this._isNightMode = false;
        } else {
            this._scene.remove(DAY_AMBIENT_LIGHT);
            this._scene.add(NIGHT_AMBIENT_LIGHT);
            this.loadSkybox(LoadedCubeTexture.nightSkyBox);
            this._isNightMode = true;
            if (this._directionalLight !== undefined) {
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
        this._directionalLight.shadow.bias = SHADOW_BIAS;
    }

}
