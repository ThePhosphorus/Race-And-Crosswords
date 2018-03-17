import {
    Vector3,
    Matrix4,
    Object3D,
    ObjectLoader,
    Euler,
    // Quaternion,
    Box3,
    Vector2
} from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../../../global-constants/constants";
import { Wheel } from "./wheel";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "../../race.constants";
import { BoxCollider } from "../collision/colliders/box-collider";
import { RigidBody } from "../rigid-body/rigid-body";
import { CarLights } from "./carLights/carLights";

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const APPROX_MAXIMUM_SPEED: number = 300;
const METER_TO_KM_SPEED_CONVERSION: number = 3.6;
const NO_BACKWARDS_ROLLING_FACTOR: number = -20;
const CAR_Y_OFFSET: number = -0.1;
const CAR_FILE: string = "../../assets/camero/";
export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private isBraking: boolean;
    private mesh: Object3D;
    private steeringWheelDirection: number;
    private isSteeringLeft: boolean;
    private isSteeringRight: boolean;
    private rigidBody: RigidBody;
    private carLights: CarLights;

    public get carMesh(): Object3D {
        return this.mesh;
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get angle(): number {
        return this.mesh.rotation.y * RAD_TO_DEG;
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
        return this.rigidBody.velocity.length();
    }

    public constructor(
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT
    ) {
        super();
        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }

        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }

        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

        this.rigidBody = new RigidBody(mass);
        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.dragCoefficient = dragCoefficient;
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.isSteeringLeft = false;
        this.isSteeringRight = false;
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
        this.mesh.add(new BoxCollider(box.getSize().z, box.getSize().x, box.getSize().y, new Vector3(0, 0, 0)));
        this.mesh.add(this.rigidBody);
        this.add(this.mesh);
        this.initCarLights();
    }

    private updateSteering(): void {
        const steeringState: number = (this.isSteeringLeft === this.isSteeringRight) ? 0 : this.isSteeringLeft ? 1 : -1;
        this.steeringWheelDirection = steeringState *
            MAXIMUM_STEERING_ANGLE * (APPROX_MAXIMUM_SPEED - (this.speed * METER_TO_KM_SPEED_CONVERSION)) / APPROX_MAXIMUM_SPEED;
    }

    // Input manager callback methods
    public accelerate(): void {
        this.isAcceleratorPressed = true;
    }

    public steerLeft(): void {
        this.isSteeringLeft = true;
    }

    public steerRight(): void {
        this.isSteeringRight = true;
    }

    public brake(): void {
        this.isBraking = true;
        this.carLights.brake();
    }

    public releaseSteeringLeft(): void {
        this.isSteeringLeft = false;
    }

    public releaseSteeringRight(): void {
        this.isSteeringRight = false;
    }

    public releaseBrakes(): void {
        this.isBraking = false;
        this.carLights.releaseBrakes();
    }

    public releaseAccelerator(): void {
        this.isAcceleratorPressed = false;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;
        this.rigidBody.addForce(this.getLongitudinalForce());
        this.rigidBody.update(deltaTime);
        // // Move to car coordinates
        // const rotationMatrix: Matrix4 = new Matrix4();
        // rotationMatrix.extractRotation(this.mesh.matrix);
        // const rotationQuaternion: Quaternion = new Quaternion();
        // rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        // this._speed.applyMatrix4(rotationMatrix);

        // // Physics calculations
        // this.physicsUpdate(deltaTime);
        // // Move back to world coordinates
        // this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // this.updateSteering();
        // // Angular rotation of the car
        // const R: number =
        //     DEFAULT_WHEELBASE /
        //     Math.sin(this.steeringWheelDirection * deltaTime);
        // const omega: number = this._speed.length() / R;
        // this.mesh.rotateY(omega);

    }

    private getLongitudinalForce(): Vector2 {
        const resultingForce: Vector2 = new Vector2();

        if (this.speed >= MINIMUM_SPEED) {
            const dragForce: Vector2 = this.getDragForce();
            const rollingResistance: Vector2 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance);
        }

        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector2 = this.direction2D;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this.isBraking && this.isGoingForward()) {
            resultingForce.add(this.getBrakeForce());
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

        if (this.isGoingForward()) {
            return this.direction2D.multiplyScalar(rollingCoefficient * this.rigidBody.mass * GRAVITY);
        }

        return this.direction2D.multiplyScalar(NO_BACKWARDS_ROLLING_FACTOR * rollingCoefficient * this.rigidBody.mass * GRAVITY);
    }

    private getDragForce(): Vector2 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector2 = this.direction2D;
        resistance.multiplyScalar(
            airDensity *
            carSurface *
            -this.dragCoefficient *
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
            GRAVITY *
            WEIGHT_DISTRIBUTION *
            NUMBER_REAR_WHEELS /
            NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getBrakeForce(): Vector2 {
        return this.direction2D.multiplyScalar(
            this.rearWheel.frictionCoefficient * this.rigidBody.mass * GRAVITY
        );
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    // private physicsUpdate(deltaTime: number): void {
    //     this.rearWheel.angularVelocity +=
    //         this.getAngularAcceleration() * deltaTime;
    //     this.engine.update(this._speed.length(), this.rearWheel.radius);
    //     this.weightRear = this.getWeightDistribution();
    //     this._speed.add(this.getDeltaSpeed(deltaTime));
    //     this._speed.setLength(
    //         this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length()
    //     );
    //     this.mesh.position.add(this.getDeltaPosition(deltaTime));
    //     this.rearWheel.update(this._speed.length());
    // }

    // private getWeightDistribution(): number {
    //     const acceleration: number = this.getAcceleration().length();
    //     /* tslint:disable:no-magic-numbers */
    //     const distribution: number =
    //         this.rigidBody.mass + 1 / this.wheelbase * this.rigidBody.mass * acceleration / 2;

    //     return Math.min(Math.max(0.25, distribution), 0.75);
    //     /* tslint:enable:no-magic-numbers */
    // }

    // private getAngularAcceleration(): number {
    //     return (
    //         this.getTotalTorque() /
    //         (this.rearWheel.inertia * NUMBER_REAR_WHEELS)
    //     );
    // }

    // private getBrakeTorque(): number {
    //     return this.getBrakeForce().length() * this.rearWheel.radius;
    // }

    // private getTractionTorque(): number {
    //     return this.getTractionForce() * this.rearWheel.radius;
    // }

    // private getTotalTorque(): number {
    //     return (
    //         this.getTractionTorque() * NUMBER_REAR_WHEELS +
    //         this.getBrakeTorque()
    //     );
    // }

    // private getAcceleration(): Vector3 {
    //     return this.getLongitudinalForce().divideScalar(this.rigidBody.mass);
    // }

    // private getDeltaSpeed(deltaTime: number): Vector3 {
    //     return this.getAcceleration().multiplyScalar(deltaTime);
    // }

    // private getDeltaPosition(deltaTime: number): Vector3 {
    //     return this.speed.multiplyScalar(deltaTime);
    // }

    private isGoingForward(): boolean {
        return this.rigidBody.velocity.clone().normalize().dot(this.direction2D) > MINIMUM_SPEED;
    }

    public getPosition(): Vector3 {
        return this.mesh.position;
    }

    public toggleNightLight(): void {
        this.carLights.toggleFrontLight();
    }

    private initCarLights(): void {
        this.carLights = new CarLights();
        this.mesh.add(this.carLights);
    }
}
