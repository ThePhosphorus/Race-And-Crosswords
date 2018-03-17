import {
    Vector3,
    Matrix4,
    Object3D,
    ObjectLoader,
    Euler,
    Quaternion,
    Box3,
    SpotLight
} from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG, RED } from "../../../global-constants/constants";
import { Wheel } from "./wheel";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "../../race.constants";
import { BoxCollider } from "../collision/colliders/box-collider";
import { SpotLightManager } from "./lights/spotlight-facade";
import {
    FRONT_LIGHT_COLOR,
    FAR_LIGHT_DISTANCE,
    FRONT_LIGHT_PENUMBRA,
    FRONT_LIGHT_HEIGHT,
    FRONT_LIGHT_LATERAL_OFFSET,
    FRONT_LIGHT_OFFSET,
    BACK_LIGHT_PENUMBRA,
    FRONT_LIGHT_ANGLE,
    BACK_LIGHT_HEIGHT,
    BACK_LIGHT_LATERAL_OFFSET,
    BACK_LIGHT_OFFSET,
    BACK_LIGHT_INTENSITY,
    SMALL_LATERAL_OFFSET,
    BIG_LATERAL_OFFSET,
    SMALL_LIGHT_ANGLE,
    NEAR_LIGHT_DISTANCE,
    SMALL_LIGHT_HEIGHT,
    SMALL_LIGHT_OFFSET,
    SMALL_LIGHT_INTENSITY
} from "./lights/lights-constants";
import { RigidBody } from "../rigid-body/rigid-body";

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const APPROX_MAXIMUM_SPEED: number = 300;
const METER_TO_KM_SPEED_CONVERSION: number = 3.6;
const NO_BACKWARDS_ROLLING_FACTOR: number = -20;
const CAR_Y_OFFSET: number = -0.1;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private frontLightManager: SpotLightManager;
    private brakeLights: Array<SpotLightManager>;
    private _speed: Vector3;
    private isBraking: boolean;
    private mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;
    private isSteeringLeft: boolean;
    private isSteeringRight: boolean;
    private rigidBody: RigidBody;

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
        this.brakeLights = new Array<SpotLightManager>();
        this.rigidBody = new RigidBody(1); // TODO Change mass
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

    public async init(position: Vector3): Promise<void> {
        this.mesh = await this.load();
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.mesh.translateY(CAR_Y_OFFSET);

        const box: Box3 = new Box3().setFromObject(this.mesh);
        this.mesh.add(new BoxCollider(box.getSize().z, box.getSize().x, box.getSize().y, new Vector3(0, 0, 0)));
        this.mesh.add(this.rigidBody);
        this.add(this.mesh);
        this.initLights();
    }

    private updateSteering(): void {
        const steeringState: number = (this.isSteeringLeft === this.isSteeringRight) ? 0 : this.isSteeringLeft ? 1 : -1;
        this.steeringWheelDirection = steeringState *
            MAXIMUM_STEERING_ANGLE * (APPROX_MAXIMUM_SPEED - (this._speed.length() * METER_TO_KM_SPEED_CONVERSION)) / APPROX_MAXIMUM_SPEED;
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
        this.brakeLights.forEach((spotlight: SpotLightManager) => spotlight.enable());
    }

    public releaseSteeringLeft(): void {
        this.isSteeringLeft = false;
    }

    public releaseSteeringRight(): void {
        this.isSteeringRight = false;
    }

    public releaseBrakes(): void {
        this.isBraking = false;
        this.brakeLights.forEach((spotlight: SpotLightManager) => spotlight.disable());
    }

    public releaseAccelerator(): void {
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
        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        this.updateSteering();
        // Angular rotation of the car
        const R: number =
            DEFAULT_WHEELBASE /
            Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this.mesh.rotateY(omega);

        this.rigidBody.update(deltaTime);
        this.lightUpdate();
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
        return this.speed.normalize().dot(this.direction) > MINIMUM_SPEED;
    }

    public getPosition(): Vector3 {
        return this.mesh.position;
    }

    public toggleNightLight(): void {
        this.frontLightManager.toggle();
    }

    private initLights(): void {
        this.initFrontLight();
        this.initBrakeLights();
    }

    // TODO Remove light stuff from car
    private initFrontLight(): void {
        const frontLight: SpotLight = new SpotLight(FRONT_LIGHT_COLOR, 0, FAR_LIGHT_DISTANCE);
        frontLight.penumbra = FRONT_LIGHT_PENUMBRA;
        this.frontLightManager =
            new SpotLightManager(
                frontLight,
                FRONT_LIGHT_HEIGHT,
                FRONT_LIGHT_LATERAL_OFFSET,
                FRONT_LIGHT_OFFSET,
                true
            );
        this.add(this.frontLightManager.light);
    }

    private initBrakeLights(): void {
        const brakeLightCenter: SpotLight = new SpotLight(RED, 0, FAR_LIGHT_DISTANCE, FRONT_LIGHT_ANGLE);
        brakeLightCenter.penumbra = BACK_LIGHT_PENUMBRA;
        const brakeLightCenterManager: SpotLightManager =
            new SpotLightManager(
                brakeLightCenter,
                BACK_LIGHT_HEIGHT,
                BACK_LIGHT_LATERAL_OFFSET,
                BACK_LIGHT_OFFSET,
                false,
                BACK_LIGHT_INTENSITY
            );

        this.brakeLights.push(brakeLightCenterManager);
        this.brakeLights.push(this.createSmallLight(SMALL_LATERAL_OFFSET));
        this.brakeLights.push(this.createSmallLight(BIG_LATERAL_OFFSET));
        this.brakeLights.push(this.createSmallLight(-BIG_LATERAL_OFFSET));
        this.brakeLights.push(this.createSmallLight(-SMALL_LATERAL_OFFSET));

        this.brakeLights.forEach((spotlight: SpotLightManager) => this.add(spotlight.light));
    }

    private createSmallLight(lateralTranslation: number ): SpotLightManager {
        const smallLight: SpotLight = new SpotLight(RED, 0, NEAR_LIGHT_DISTANCE, SMALL_LIGHT_ANGLE);

        return new SpotLightManager(
            smallLight,
            SMALL_LIGHT_HEIGHT,
            lateralTranslation,
            SMALL_LIGHT_OFFSET,
            true,
            SMALL_LIGHT_INTENSITY
        );
    }

    private lightUpdate(): void {
        this.frontLightManager.update(this.mesh.position, this.direction);
        this.brakeLights.forEach((spotlight: SpotLightManager) => spotlight.update(this.mesh.position, this.direction));
    }
}
