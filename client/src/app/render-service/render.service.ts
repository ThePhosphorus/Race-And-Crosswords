import { Injectable } from "@angular/core";
import { CubeTextureLoader, Mesh, Texture, TextureLoader, RepeatWrapping, MeshLambertMaterial, PlaneGeometry, DoubleSide, DirectionalLight, MeshPhongMaterial, Vector3} from "three";
import { Car } from "../car/car";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Renderer } from "../renderer/renderer";

const FLOOR_DIMENSION: number = 10000;
const SPAWN_DIMENSION: number = 100;
const FLOOR_TEXTURE_RATIO: number = 0.1;
const OFF_ROAD_Z_TRANSLATION: number = 0.01;
const OFF_ROAD_PATH: string = "../../assets/textures/grass.jpg";
const TRACK_PATH: string = "../../assets/textures/floor.jpg";
const HALF: number = 0.5;
const PI_OVER_2: number = Math.PI * HALF;
const BACKGROUND_PATH: string = "../../assets/skybox/sky1/";
const dLight: number = 200;
const sLight: number = dLight * 0.25;

@Injectable()
export class RenderService extends Renderer {
    private _car: Car;
    private _carInfos: CarInfos;
    private light: DirectionalLight;

    public constructor(private cameraManager: CameraManagerService) {
        super(cameraManager, false);
        this._car = new Car();
        this._carInfos = new CarInfos(0, 0, 0);
    }

    public get carInfos(): CarInfos {
        return this._carInfos;
    }

    public handleCarInputsDown(carControls: CarControls): void {
        switch (carControls) {
            case CarControls.Accelerate:
                this._car.isAcceleratorPressed = true;
                break;
            case CarControls.Brake:
                this._car.brake();
                break;
            case CarControls.Left:
                this._car.steerLeft();
                break;
            case CarControls.Right:
                this._car.steerRight();
                break;
            default:
                break;
        }
    }

    public handleCarInputsUp(carControls: CarControls): void {
        switch (carControls) {
            case CarControls.Accelerate:
                this._car.isAcceleratorPressed = false;
                break;
            case CarControls.Brake:
                this._car.releaseBrakes();
                break;
            case (CarControls.Left):
                this._car.releaseSteering();
                break;
            case (CarControls.Right):
                this._car.releaseSteering();
                break;
            default:
                break;
        }
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        this.init(container);
        this.light = new DirectionalLight( 0xffe382, 0.7 );
        this.light.position.set(-1, 1, -1);
        this.light.position.multiplyScalar(25);
        this.light.castShadow = true;
        this.light.shadow.camera.bottom = -sLight;
        this.light.shadow.camera.top = sLight;
        this.light.shadow.camera.left = -sLight;
        this.light.shadow.camera.right = sLight;
        this.light.shadow.camera.near = dLight/30;
        this.light.shadow.camera.far = dLight;
        this.light.shadow.mapSize.x = 1024 * 2;
        this.light.shadow.mapSize.y = 1024 * 2;
        //const helper: CameraHelper = new CameraHelper(this.light.shadow.camera);
        //this.scene.add(helper);
        this.scene.add(this.light);

        await this._car.init();
        this.cameraManager.updatecarInfos(
            this._car.getPosition(),
            this._car.direction
        );
        this.scene.add(this._car);
        this.scene.add(this.getFloor());
        this.scene.add(this.getTrack());

        this.startRenderingLoop();
    }

    private getFloor(): Mesh {
        const texture: Texture = new TextureLoader().load(OFF_ROAD_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO, FLOOR_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshLambertMaterial = new MeshLambertMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(FLOOR_DIMENSION, FLOOR_DIMENSION), material);
        plane.rotateX(PI_OVER_2);
        plane.receiveShadow = true;
        plane.translateZ(OFF_ROAD_Z_TRANSLATION);

        return plane;
    }

    private getTrack(): Mesh {
        const texture: Texture = new TextureLoader().load(TRACK_PATH);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO, SPAWN_DIMENSION * FLOOR_TEXTURE_RATIO);
        const material: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        const plane: Mesh = new Mesh(new PlaneGeometry(SPAWN_DIMENSION, SPAWN_DIMENSION), material);
        plane.receiveShadow = true;
        plane.rotateX(PI_OVER_2);

        return plane;
    }

    protected onInit(): void {
        this.scene.background = new CubeTextureLoader()
            .setPath(BACKGROUND_PATH)
            .load([
                "posx.png",
                "negx.png",
                "posy.png",
                "negy.png",
                "posz.png",
                "negz.png"
            ]);
    }

    protected update(timeSinceLastFrame: number): void {
        this._car.update(timeSinceLastFrame);
        this.cameraTargetDirection = this._car.direction;
        this.cameraTargetPosition = this._car.getPosition();
        this.updateCarInfos();
        const offSet: Vector3 = new Vector3(-10, 10, -10);
        const newPosition: Vector3 = new Vector3(this.light.shadow.camera.position.x, this.light.shadow.camera.position.y, this.light.shadow.camera.position.z);
        newPosition.add(offSet);
        this.light.position.copy((this._car.getPosition().clone().add(offSet)));
        this.light.target = this._car["mesh"];
    }

    private updateCarInfos(): void {
        this._carInfos.speed = this._car.speed.length();
        this._carInfos.gear = this._car.currentGear;
        this._carInfos.rpm = this._car.rpm;
    }
}

export class CarInfos {
    public constructor(
        public speed: number,
        public gear: number,
        public rpm: number
    ) { }
}

export enum CarControls {
    Accelerate,
    Brake,
    Left,
    Right
}
