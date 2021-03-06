import {
    Vector3,
    Matrix4,
    Object3D,
    Euler,
    Box3,
    Vector2,
    AudioListener
} from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, METER_TO_KM_SPEED_CONVERSION, DOUBLE } from "../../../global-constants/constants";
import {
    DEFAULT_WHEELBASE,
    DEFAULT_MASS,
    DRAG_COEFFICIENT,
    DEFAULT_WHEEL_RADIUS,
    DEFAULT_FRICTION_COEFFICIENT
} from "../../race.constants";
import { Collider } from "../collision/collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { CarLights } from "./car-lights/car-lights";
import { CarControl } from "./car-control";
import { CarSounds } from "../sound-manager-service/sound-facades/car-sounds";
import { LoaderService } from "../loader-service/loader.service";
import { LoadedObject } from "../loader-service/load-types.enum";

const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const WHEEL_DISTRIBUTION: number = 0.6;
const APPROX_MAXIMUM_SPEED: number = 280;
const CAR_Y_OFFSET: number = -0.1;
const DEFAULT_STEERING_ANGLE: number = 0.15;
const HANDBRAKE_STEERING_ANGLE: number = 0.4;
const DEFAULT_FRICTION: number = 400000;
const HANDBRAKE_FRICTION: number = 50000;
const PROGRESSIVE_DRIFT_COEFFICIENT: number = 1800;
const DRIFT_SOUND_MAX: number = 150000;
const MIN_DRIFT_SPEED: number = METER_TO_KM_SPEED_CONVERSION * DOUBLE;
const WALL_FRICTION: number = -8000;
const BRAKE_MULTIPLIER: number = 3;
const HANDICAP_FACTOR: number = 0.75;

export class Car extends Object3D {
    public carControl: CarControl;

    private readonly _engine: Engine;
    private _mesh: Object3D;
    private _rigidBody: RigidBody;
    private _carLights: CarLights;
    private _frictionCoefficient: number;
    private _carSound: CarSounds;

    public get currentGear(): number {
        return this._engine.currentGear;
    }

    public get rpm(): number {
        return this._engine.rpm;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public get direction2D(): Vector2 {
        return new Vector2(this.direction.x, this.direction.z);
    }

    public get speed(): number {
        return this._mesh == null ? 0 : this._rigidBody.velocity.clone().dot(this.direction2D);
    }

    public get rigidBody(): RigidBody {
        return this._rigidBody;
    }

    public constructor(
        private isAi: Boolean,
        engine: Engine = new Engine(),
        mass: number = DEFAULT_MASS
    ) {
        super();
        this._rigidBody = new RigidBody(mass);
        this._engine = engine;
        this.carControl = new CarControl();
        this._frictionCoefficient = DEFAULT_FRICTION;
    }

    public init(position: Vector3, loader: LoaderService, type: LoadedObject, audioListener: AudioListener): void {
        this._mesh = loader.getObject(type);
        this._mesh.position.set(position.x, position.y, position.z);
        this._mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this._mesh.translateY(CAR_Y_OFFSET);

        const box: Box3 = new Box3().setFromObject(this._mesh);
        this._mesh.add(new Collider(box.getSize().z, box.getSize().x));
        this._mesh.add(this._rigidBody);
        this.add(this._mesh);
        this._carSound = new CarSounds(this.mesh, audioListener, loader);
        this._rigidBody.addCollisionObserver((otherRb) => this.onCollision(otherRb));
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
        this._engine.update(Math.abs(this.speed), DEFAULT_WHEEL_RADIUS);

        this._rigidBody.addForce(this.getLongitudinalForce());
        this._rigidBody.addFrictionForce(this.getPerpendicularForce());
        this._rigidBody.update(deltaTime);

        const R: number =
            DEFAULT_WHEELBASE /
            Math.sin(this.getSteeringDirection() * deltaTime);
        const omega: number = this.speed / R;
        this._mesh.rotateY(omega);
        this._carSound.updateRPM(this._engine.rpm);
    }

    private getPerpendicularForce(): Vector2 {
        const direction: Vector2 = this.direction2D;
        const perpDirection: Vector2 = (new Vector2(direction.y, -direction.x));
        const perpSpeedComponent: number = this._rigidBody.velocity.clone().normalize().dot(perpDirection);
        this._frictionCoefficient = Math.min(
            this._frictionCoefficient + PROGRESSIVE_DRIFT_COEFFICIENT,
            this.isAi ? DEFAULT_FRICTION : DEFAULT_FRICTION * HANDICAP_FACTOR);
        if (this.carControl.hasHandbrakeOn) {
            this._frictionCoefficient = HANDBRAKE_FRICTION;
            this._carLights.brake();
        }
        this.updateDriftSound(this._frictionCoefficient);

        return perpDirection.multiplyScalar(-perpSpeedComponent * this._frictionCoefficient);
    }

    private getLongitudinalForce(): Vector2 {
        const resultingForce: Vector2 = new Vector2();
        const dragForce: Vector2 = this.getDragForce();
        const rollingResistance: Vector2 = this.getRollingResistance();
        const tractionForce: number = this.isAi ? this.getTractionForce() : this.getTractionForce() * HANDICAP_FACTOR;
        const accelerationForce: Vector2 = this.direction2D;

        resultingForce.add(dragForce).add(rollingResistance);

        if (this.carControl.isAcceleratorPressed) {
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
            this.turnOffRearLights();
        } else if (this.carControl.isBraking && this.isGoingForward()) {
            resultingForce.add(this.getBrakeForce());
            this._carLights.releaseReverse();
            this._carLights.brake();
        } else if (this.carControl.isBraking) {
            this._carLights.releaseBrakes();
            this._carLights.reverse();
            if (Math.abs(this.speed) < DOUBLE * METER_TO_KM_SPEED_CONVERSION) {
                accelerationForce.multiplyScalar(tractionForce);
                resultingForce.sub(accelerationForce);
            }
        } else {
            this.turnOffRearLights();
        }

        return resultingForce;
    }
    private turnOffRearLights(): void {
        this._carLights.releaseBrakes();
        this._carLights.releaseReverse();
    }
    private getRollingResistance(): Vector2 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        /* tslint:disable:no-magic-numbers */
        const rollingCoefficient: number =
            1 / tirePressure *
            (Math.pow(this.speed * METER_TO_KM_SPEED_CONVERSION / 100, 2) * 0.0095 + 0.01) + 0.005;
        /* tslint:enable:no-magic-numbers */

        return this.direction2D.multiplyScalar(Math.sign(this.speed) * rollingCoefficient * this._rigidBody.mass * GRAVITY);
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
            DEFAULT_FRICTION_COEFFICIENT *
            this._rigidBody.mass *
            WHEEL_DISTRIBUTION *
            GRAVITY;

        return -Math.min(force, maxForce);
    }

    private getBrakeForce(): Vector2 {
        return this.isGoingForward ?
            this.direction2D.multiplyScalar(
                Math.sign(this.speed) * DEFAULT_FRICTION_COEFFICIENT * this._rigidBody.mass * GRAVITY * BRAKE_MULTIPLIER) :
            new Vector2(0, 0);
    }

    private getEngineForce(): number {
        return this._engine.getDriveTorque() / DEFAULT_WHEEL_RADIUS;
    }

    private isGoingForward(): boolean {
        return this.speed > 0;
    }

    public getPosition(): Vector3 {
        return this._mesh.position;
    }

    public get mesh(): Object3D {
        return this._mesh;
    }

    public toggleNightLight(): void {
        this._carLights.toggleFrontLight();
    }

    public toggleNightLightShadows(): void {
        this._carLights.toggleShadows();
    }

    private onCollision(otherRb: RigidBody): void {
        this.collisionSound();
        if (otherRb.fixed) {
            this.wallPenalty();
        } else {
            this.carPenalty();
        }
    }

    private collisionSound(): void {
        this._carSound.playCollision();
    }

    private updateDriftSound(factor: number): void {
        if (factor < DRIFT_SOUND_MAX && this.speed > MIN_DRIFT_SPEED) {
            this._carSound.startDrift();
        } else if (this._carSound.drift.isPlaying()) {
            this._carSound.releaseDrift();
        }
    }

    private carPenalty(): void {
        this._frictionCoefficient = HANDBRAKE_FRICTION;
    }

    private wallPenalty(): void {
        this._rigidBody.addFrictionForce(this.direction2D.multiplyScalar(WALL_FRICTION * Math.sign(this.speed)));
    }

    public initCarLights(isAiCar: boolean): void {
        this._carLights = new CarLights(isAiCar);
        this._mesh.add(this._carLights);
    }
}
