import {
    Vector3,
    Matrix4,
    Object3D,
    ObjectLoader,
    Euler,
    Quaternion,
    SpotLight
} from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../../../global-constants/constants";
import { Wheel } from "./wheel";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "../../race.constants";
import { SpotLightFacade } from "./lights/spotlight-facade";

const MAXIMUM_STEERING_ANGLE: number = 0.5;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const APPROX_MAXIMUM_SPEED: number = 300;
const METER_TO_KM_SPEED_CONVERSION: number = 3.6;
const NO_BACKWARDS_ROLLING_FACTOR: number = -20;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private frontLightFacade: SpotLightFacade;
    private brakeLights: Array<SpotLightFacade>;
    private _speed: Vector3;
    private isBraking: boolean;
    private mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;
    private isSteeringLeft: boolean;
    private isSteeringRight: boolean;

    public get carMesh(): Object3D {
        return this.mesh;
    }
    public get speed(): Vector3 {
        return this._speed.clone();
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

        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.mass = mass;
        this.dragCoefficient = dragCoefficient;
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.isSteeringLeft = false;
        this.isSteeringRight = false;
        this.brakeLights = new Array<SpotLightFacade>();
    }

    // TODO: move loading code outside of car class.
    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(
                "../../assets/camero/camero-2010-low-poly.json",
                (object) => {
                    resolve(object);
                }
            );
        });
    }

    public async init(): Promise<void> {
        this.mesh = await this.load();
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.add(this.mesh);
        this.initLights();
    }
    private initLights(): void {
       this.initFrontLight();
       this.initBrakeLights();

    }
    private initFrontLight(): void {
        const frontLight: SpotLight = new SpotLight(0xFFE6CC, 1, 15 );
        frontLight.penumbra = 0.4;
        this.frontLightFacade = new SpotLightFacade(frontLight, 1, 0, 1, true);
        this.add(this.frontLightFacade.light);
    }

    private initBrakeLights(): void {
         const brakeLightCenter: SpotLight = new SpotLight(0xFF0000, 0, 15, 0.6);
         brakeLightCenter.penumbra = 0.6;
         const brakeLightCenterFacade: SpotLightFacade = new SpotLightFacade(brakeLightCenter, 0.75, 0, -0.7, false);
         this.brakeLights.push(brakeLightCenterFacade);
         this.brakeLights.forEach((spotlight: SpotLightFacade) => this.add(spotlight.light));
    }
    private updateSteering(): void {
        const steeringState: number = (this.isSteeringLeft === this.isSteeringRight) ? 0 : this.isSteeringLeft ? 1 : -1;
        this.steeringWheelDirection = steeringState *
        MAXIMUM_STEERING_ANGLE * (APPROX_MAXIMUM_SPEED - (this._speed.length() * METER_TO_KM_SPEED_CONVERSION)) / APPROX_MAXIMUM_SPEED;
    }

    // Input manager callback methods
    public accelerate (): void {
        this.isAcceleratorPressed = true;
    }

    public steerLeft (): void {
        this.isSteeringLeft = true;
    }

    public steerRight (): void {
        this.isSteeringRight = true;
    }

    public brake (): void {
        this.isBraking = true;
        this.brakeLights.forEach((spotlight: SpotLightFacade) => spotlight.enable());
    }

    public releaseSteeringLeft (): void {
        this.isSteeringLeft = false;
    }

    public releaseSteeringRight (): void {
        this.isSteeringRight = false;
    }

    public releaseBrakes (): void {
        this.isBraking = false;
        this.brakeLights.forEach((spotlight: SpotLightFacade) => spotlight.disable());
    }

    public releaseAccelerator (): void {
        this.isAcceleratorPressed = false;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this.mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        this.physicsUpdate(deltaTime);
        this.lightUpdate();

        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        this.updateSteering();
        // Angular rotation of the car
        const R: number =
            DEFAULT_WHEELBASE /
            Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this.mesh.rotateY(omega);
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity +=
            this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(
            this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length()
        );
        this.mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }
    private lightUpdate(): void {
        this.frontLightFacade.update(this.mesh.position, this.direction);
        this.brakeLights.forEach((spotlight: SpotLightFacade) => spotlight.update(this.mesh.position, this.direction));
    }
    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this.mass + 1 / this.wheelbase * this.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance);
        }

        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        }

        return resultingForce;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html

        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number =
            1 / tirePressure *
                (Math.pow(this.speed.length() * METER_TO_KM_SPEED_CONVERSION / 100, 2) * 0.0095 + 0.01) + 0.005;

        if (this.isGoingForward()) {
        return this.direction.multiplyScalar(rollingCoefficient * this.mass * GRAVITY);
        }

        return this.direction.multiplyScalar(NO_BACKWARDS_ROLLING_FACTOR * rollingCoefficient * this.mass * GRAVITY);
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(
            airDensity *
                carSurface *
                -this.dragCoefficient *
                this.speed.length() *
                this.speed.length()
        );

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient *
            this.mass *
            GRAVITY *
            this.weightRear *
            NUMBER_REAR_WHEELS /
            NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return (
            this.getTotalTorque() /
            (this.rearWheel.inertia * NUMBER_REAR_WHEELS)
        );
    }

    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY
        );
    }

    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }

    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }

    private getTotalTorque(): number {
        return (
            this.getTractionTorque() * NUMBER_REAR_WHEELS +
            this.getBrakeTorque()
        );
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this.mass);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    private isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > MINIMUM_SPEED;
    }

    public getPosition(): Vector3 {
        return this.mesh.position;
    }

    public toggleNightLight(): void {
        this.frontLightFacade.toggle();
    }
}
