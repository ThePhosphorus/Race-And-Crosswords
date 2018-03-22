import {
    Vector3,
    Matrix4,
    Object3D,
    ObjectLoader,
    Euler,
    Box3,
    Vector2
} from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2 } from "../../../global-constants/constants";
import { Wheel } from "./wheel";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DRAG_COEFFICIENT } from "../../race.constants";
import { BoxCollider } from "../collision/colliders/box-collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { CarLights } from "./carLights/carLights";
import { CarControl } from "./car-control";
import { CarSounds } from "../sound-manager-service/sound-facades/car-sounds";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";

const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const WHEEL_DISTRIBUTION: number = 0.6;
const APPROX_MAXIMUM_SPEED: number = 300;
const METER_TO_KM_SPEED_CONVERSION: number = 3.6;
const CAR_Y_OFFSET: number = -0.1;
const CAR_FILE: string = "../../assets/camero/";
const DEFAULT_STEERING_ANGLE: number = 0.15;
const HANDBRAKE_STEERING_ANGLE: number = 0.4;
const DEFAULT_FRICTION: number = 400000;
const HANDBRAKE_FRICTION: number = 50000;
const PROGRESSIVE_DRIFT_COEFFICIENT: number = 1800;
const DRIFT_SOUND_MAX: number = 150000;
const MIN_DRIFT_SPEED_M_S: number = 0.7;
const MIN_DRIFT_SPEED: number = METER_TO_KM_SPEED_CONVERSION * MIN_DRIFT_SPEED_M_S;

export class Car extends Object3D {
    public carControl: CarControl;

    private readonly engine: Engine;
    private readonly rearWheel: Wheel;
    private mesh: Object3D;
    private rigidBody: RigidBody;
    private carLights: CarLights;
    private frictionCoefficient: number;
    private carSound: CarSounds;
    private hasPenalty: boolean;

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this.mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public get direction2D(): Vector2 {
        return new Vector2(this.direction.x, this.direction.z);
    }

    public get speed(): number {
        return this.mesh == null ? 0 : this.rigidBody.velocity.clone().dot(this.direction2D);
    }

    public constructor(
        private cameraManager: CameraManagerService,
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        mass: number = DEFAULT_MASS
    ) {
        super();
        this.rigidBody = new RigidBody(mass);
        this.engine = engine;
        this.rearWheel = rearWheel;
        this.carControl = new CarControl();
        this.frictionCoefficient = DEFAULT_FRICTION;
    }

    // TODO: move loading code outside of car class.
    private async load(color: string): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(
                CAR_FILE + color + ".json",
                (object) => {
                    resolve(object);
                }
            );
        });
    }

    public async init(position: Vector3, color: string): Promise<void> {
        this.mesh = await this.load(color);
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.mesh.translateY(CAR_Y_OFFSET);

        const box: Box3 = new Box3().setFromObject(this.mesh);
        this.mesh.add(new BoxCollider(box.getSize().z, box.getSize().x, box.getSize().y));
        this.mesh.add(this.rigidBody);
        this.add(this.mesh);
        this.initCarLights();
        this.carSound = new CarSounds(this.mesh, this.cameraManager.audioListener);
        this.rigidBody.addCollisionObserver(() => this.onCollision());
    }

    private getSteeringDirection(): number {
        const steeringState: number = (this.carControl.isSteeringLeft === this.carControl.isSteeringRight) ? 0 :
            this.carControl.isSteeringLeft ? 1 : -1;

        return steeringState *
            (this.carControl.hasHandbrakeOn ? HANDBRAKE_STEERING_ANGLE : DEFAULT_STEERING_ANGLE) *
            (APPROX_MAXIMUM_SPEED - (this.speed * METER_TO_KM_SPEED_CONVERSION)) / APPROX_MAXIMUM_SPEED;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;
        this.engine.update(this.speed, this.rearWheel.radius);

        this.rigidBody.addForce(this.getLongitudinalForce());
        this.rigidBody.setFrictionForce(this.getPerpendicularForce());
        this.rigidBody.update(deltaTime);

        const R: number =
            DEFAULT_WHEELBASE /
            Math.sin(this.getSteeringDirection() * deltaTime);
        const omega: number = this.speed / R;
        this.mesh.rotateY(omega);
        this.carSound.updateRPM(this.engine.rpm);
    }

    private getPerpendicularForce(): Vector2 {
        const direction: Vector2 = this.direction2D;
        const perpDirection: Vector2 = (new Vector2(direction.y, -direction.x));
        const perpSpeedComponent: number = this.rigidBody.velocity.clone().normalize().dot(perpDirection);
        this.frictionCoefficient = Math.min(this.frictionCoefficient + PROGRESSIVE_DRIFT_COEFFICIENT, DEFAULT_FRICTION);
        if (!this.hasPenalty && this.carControl.hasHandbrakeOn) {
            this.frictionCoefficient = HANDBRAKE_FRICTION;
            this.carLights.brake();
        } else if (this.frictionCoefficient >= DEFAULT_FRICTION) {
            this.hasPenalty = false;
        }
        this.updateDriftSound(this.frictionCoefficient);

        return perpDirection.multiplyScalar(-perpSpeedComponent * this.frictionCoefficient);
    }

    private getLongitudinalForce(): Vector2 {
        const resultingForce: Vector2 = new Vector2();
        const dragForce: Vector2 = this.getDragForce();
        const rollingResistance: Vector2 = this.getRollingResistance();
        resultingForce.add(dragForce).add(rollingResistance);

        if (this.carControl.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector2 = this.direction2D;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
            this.carLights.releaseBrakes();
            this.carLights.releaseReverse();
        } else if (this.carControl.isBraking && this.isGoingForward()) {
            resultingForce.add(this.getBrakeForce());
            this.carLights.releaseReverse();
            this.carLights.brake();
        } else if (this.carControl.isBraking) {
            this.carLights.releaseBrakes();
            this.carLights.reverse();
            if (Math.abs(this.speed) < 2 * METER_TO_KM_SPEED_CONVERSION){
                const tractionForce: number = this.getTractionForce();
                const accelerationForce: Vector2 = this.direction2D;
                accelerationForce.multiplyScalar(tractionForce);
                resultingForce.sub(accelerationForce);
            }
        }

        return resultingForce;
    }

    private getRollingResistance(): Vector2 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        /* tslint:disable:no-magic-numbers */
        const rollingCoefficient: number =
            1 / tirePressure *
            (Math.pow(this.speed * METER_TO_KM_SPEED_CONVERSION / 100, 2) * 0.0095 + 0.01) + 0.005;
        /* tslint:enable:no-magic-numbers */

        return this.direction2D.multiplyScalar(Math.sign(this.speed) * rollingCoefficient * this.rigidBody.mass * GRAVITY);
    }

    private getDragForce(): Vector2 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector2 = this.direction2D;
        resistance.multiplyScalar(
            Math.sign(this.speed) *
            airDensity *
            carSurface *
            -DRAG_COEFFICIENT *
            this.speed *
            this.speed
        );

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient *
            this.rigidBody.mass *
            WHEEL_DISTRIBUTION *
            GRAVITY;

        return -Math.min(force, maxForce);
    }

    private getBrakeForce(): Vector2 {
        if (this.isGoingForward) {
            return this.direction2D.multiplyScalar(
                Math.sign(this.speed) * this.rearWheel.frictionCoefficient * this.rigidBody.mass * GRAVITY
            );
        } else {

        }
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private isGoingForward(): boolean {
        return this.speed > 0;
    }

    public getPosition(): Vector3 {
        return this.mesh.position;
    }

    public toggleNightLight(): void {
        this.carLights.toggleFrontLight();
    }

    private onCollision(): void {
        this.collisionSound();
        this.carPenalty();
    }

    private collisionSound(): void {
        this.carSound.playCollision();
    }

    private updateDriftSound(factor: number): void {
        if (factor < DRIFT_SOUND_MAX && this.speed > MIN_DRIFT_SPEED) {
            this.carSound.startDrift();
        } else if (this.carSound.drift.isPlaying()) {
            this.carSound.releaseDrift();
        }
    }

    private carPenalty(): void {
        this.hasPenalty = true;
        this.frictionCoefficient = HANDBRAKE_FRICTION;
    }

    private initCarLights(): void {
        this.carLights = new CarLights();
        this.mesh.add(this.carLights);
    }
}
