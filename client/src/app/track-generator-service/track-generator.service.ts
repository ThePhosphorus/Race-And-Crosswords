import {
    Vector3,
    GridHelper,
    Color,
    AmbientLight,
    Vector2,
    Mesh,
    Geometry,
    Line,
    Object3D
} from "three";
import { CameraManagerService, CameraType, ZoomLimit } from "../camera-manager-service/camera-manager.service";
import { ZOOM_IN_KEYCODE, ZOOM_OUT_KEYCODE } from "../input-manager-service/input-manager.service";
import * as C from "./track.constantes";
import { Renderer } from "../renderer/renderer";
import { ConstraintValidatorService } from "./constraint-validator/constraint-validator";
import { Injectable } from "@angular/core";
import { PointsHandler } from "./points-handler/points-handler";

const LINE_STR_PREFIX: string = "Line to ";

const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 100;
const HALF: number = 0.5;
const DOUBLE: number = 2;
const LEFT_CLICK_CODE: number = 0;
const MIDDLE_CLICK_CODE: number = 1;
const RIGHT_CLICK_CODE: number = 2;
const LINK_MINIMUM_POINTS: number = 2;
const DELETE_KEY: number = 46;

@Injectable()
export class TrackGenerator extends Renderer {
    private _cameraPosition: Vector3;
    private _cameraDirection: Vector3;
    private _gridHelper: GridHelper;
    private _dragPoints: C.PointsSpan;
    private onMouseMoveListner: EventListenerObject;
    private onMouseTranslateListner: EventListenerObject;
    private _lastTranslatePosition: Vector3;
    public points: PointsHandler;

//////////////////////// Constructor

    public constructor(private cameraManager: CameraManagerService,
                       private constraintValidator: ConstraintValidatorService) {
        super(cameraManager, true);
        this.points = new PointsHandler(this);
        this.constraintValidator.setPoints(this.points.points);
        this.onMouseMoveListner = this.onMouseMove.bind(this);
        this.onMouseTranslateListner = this.onTranslateCamera.bind(this);
    }

//////////////////////// Rendering
    public setContainer(container: HTMLDivElement): void {
        this.init(container);
        this.startRenderingLoop();
    }

    protected onInit(): void {
        this._cameraDirection = C.CAMERA_STARTING_DIRECTION;
        this._cameraPosition = C.CAMERA_STARTING_POSITION;

        this.cameraManager.updatecarInfos(
            this._cameraPosition,
            this._cameraDirection
        );
        this.cameraManager.cameraType = CameraType.Ortho;
        this._gridHelper = new GridHelper(
            C.GRID_DIMENSION,
            C.GRID_DIVISIONS,
            new Color(C.GRID_PRIMARY_COLOR),
            new Color(C.GRID_SECONDARY_COLOR)
        );
        this.scene.add(this._gridHelper);
        this.scene.add(new AmbientLight(C.WHITE, C.AMBIENT_LIGHT_OPACITY));
        this.cameraManager.cameraDistanceToCar = C.STARTING_CAMERA_HEIGHT;
        this.cameraManager.zoomLimits = new ZoomLimit(MIN_ZOOM, MAX_ZOOM);
    }

    protected update(timeSinceLastFrame: number): void {
        this.cameraManager.updatecarInfos(
            this._cameraPosition,
            this._cameraDirection
        );
    }

//////////////////////// Input

    public InputKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ZOOM_IN_KEYCODE:
                this.cameraManager.zoomIn();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomOut();
                break;
            case DELETE_KEY:
                if (this.points.pointSelected()) {
                    this.points.removePoint(this.points.selectedPointId);
                }
                break;
            default:
                break;
        }
    }

    public InputKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ZOOM_IN_KEYCODE:
                this.cameraManager.zoomRelease();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomRelease();
                break;
            default:
                break;
        }
    }

    public mouseEventclick(event: MouseEvent): void {
        if (event.button === LEFT_CLICK_CODE) {
            this.mouseEventLeftClick(event);
        } else if (event.button === MIDDLE_CLICK_CODE) {
            this.mouseEventMiddleClick(event);
        } else if (event.button === RIGHT_CLICK_CODE) {
            this.points.removePoint(this.points.length - 1);
        }
    }

    public mouseEventReleaseClick(event: MouseEvent): void {
        this.disableDragMode();
        this.disableTranslateMode();
        this.points.updateStartingPosition();
        this.resetValidation(this.points.points);
    }

    public mouseWheelEvent(event: MouseWheelEvent): void {
        if (event.offsetX > 0 && event.offsetX < this.container.offsetWidth &&
            event.offsetY > 0 && event.offsetY < this.container.offsetHeight ) {
                this.cameraManager.cameraDistanceToCar =
                this.cameraManager.cameraDistanceToCar + event.deltaY / 50; // HACK: Find better way
            }
    }

    private mouseEventMiddleClick(event: MouseEvent): void {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.points.removePoint(possiblePointId);
        } else {
            this.enableTranslateMode();
        }
    }

    private mouseEventLeftClick(event: MouseEvent): void {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.points.selectPoint(possiblePointId);
            this.enableDragMode(possiblePointId);
        } else {
            // Remove connection to spawn point
            if (this.points.length > LINK_MINIMUM_POINTS &&
                this.points.top.position.clone().sub(this.points.point(0).position).length() < C.POINT_SELECTION_PRECISION) {
                this.points.removePoint(this.points.length - 1);
            }

            const newPoint: Mesh = this.createDot(new Vector2(event.offsetX, event.offsetY), (this.points.top) ? this.points.top.position : null);
            this.points.push(newPoint);
            this.points.updateStartingPosition();
            this.points.selectPoint(this.points.length - 1);
        }
    }

    private onMouseMove(event: MouseEvent): void {
        this._dragPoints.point.position.copy(this.getRelativePosition(new Vector2(event.offsetX, event.offsetY)));
        if (this._dragPoints.closingPoint) {
            this._dragPoints.closingPoint.position.copy(this.getRelativePosition(new Vector2(event.offsetX, event.offsetY)));
            this.updateLine(this._dragPoints.closingPoint, this._dragPoints.before, null);
            this.updateLine(this._dragPoints.point, null, this._dragPoints.after);
        } else {
            this.updateLine(this._dragPoints.point, this._dragPoints.before, this._dragPoints.after);
        }

    }

    private onTranslateCamera(event: MouseEvent): void {
        const point: Vector3 = this.getRelativePosition(new Vector2(event.offsetX, event.offsetY));
        if (!this._lastTranslatePosition) {
            this._lastTranslatePosition = point;
        }
        this._cameraPosition.add(this._lastTranslatePosition.clone().sub(point));
        this._lastTranslatePosition = point;
    }

//////////////////////// ThreeJs object handeling

    public createDot(pos: Vector2, topMesh: Vector3): Mesh {
        const circle: Mesh = new Mesh(C.SPHERE_GEOMETRY, C.WHITE_MATERIAL);
        circle.position.copy(this.getRelativePosition(pos));
        if (topMesh) { this.createLine(topMesh, circle.position, circle.id); }
        this.scene.add(circle);
        this.disableDragMode();

        return circle;
    }

    public removeObject(obj: Mesh, before?: Mesh, after?: Mesh): void {
        const id: number = obj.id;
        this.scene.remove(this.scene.getObjectById(id));
        const line: Object3D = this.scene.getObjectByName(LINE_STR_PREFIX + id);
        if (after) {
            const nextLine: Object3D = this.scene.getObjectByName(LINE_STR_PREFIX + after.id);
            this.scene.remove(nextLine);
        }

        this.scene.remove(line);

        if (before && after) {
            this.createLine(before.position, after.position, after.id);
        }

        this.disableDragMode();
    }

    public updateLine(point: Mesh, before?: Mesh, after?: Mesh): void {
        if (before) {
            const beforeLine: Object3D = this.scene.getObjectByName(LINE_STR_PREFIX + point.id);
            this.scene.remove(beforeLine);
            this.createLine(before.position, point.position, point.id);
        }

        if (after) {
            const nextLine: Object3D = this.scene.getObjectByName(LINE_STR_PREFIX + after.id);
            this.scene.remove(nextLine);
            this.createLine(point.position, after.position, after.id);
        }
    }

    private createLine(from: Vector3, to: Vector3, id: number): void {
        const lineG: Geometry = new Geometry();
        lineG.vertices.push(from, to);
        const line: Line = new Line(lineG, this.constraintValidator.validateLine(from, to) ? C.LINE_MATERIAL : C.LINE_MATERIAL_INVALID);
        line.name = LINE_STR_PREFIX + id;
        this.scene.add(line);
    }

//////////////////////// Converters and tools

    public getRelativePosition(pos: Vector2): Vector3 {
        const htmlElem: HTMLCanvasElement = this.renderer.domElement;
        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x - HALF * htmlElem.clientWidth,
            pos.y - HALF * htmlElem.clientHeight
        );

        return new Vector3(
            clientClickPos.x * cameraClientRatio.x + this._cameraPosition.x,
            C.LINE_Y_POSITION,
            clientClickPos.y * cameraClientRatio.y + this._cameraPosition.z
        );
    }

    public getClientPosition(pos: Vector3): Vector2 {
        const htmlElem: HTMLCanvasElement = this.renderer.domElement;

        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            (pos.x - this._cameraPosition.x ) /  cameraClientRatio.x,
            (pos.z - this._cameraPosition.z ) / cameraClientRatio.y
        );

        return new Vector2(
            clientClickPos.x + HALF * htmlElem.clientWidth,
            clientClickPos.y + HALF * htmlElem.clientHeight
        );
    }

    private findPointId(pos: Vector2): number {
        for (let i: number = this.points.length - 1; i >= 0; i--) {
            const diff: number = this.getClientPosition(this.points.point(i).position).sub(pos).length();
            if (diff <= C.POINT_SELECTION_PRECISION) {
                return i;
            }
        }

        return null;
    }

    public get PositionSelectPoints(): C.PosSelect[] {
        return this.points.PositionSelectPoints;
    }
//////////////////////// event functions
    public disableDragMode(): void {
        this.container.removeEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private enableDragMode(pointId: number): void {
        if ((pointId === this.points.length - 1 || pointId === 0) && this.points.top.position.equals(this.points.point(0).position)) {
            this.enableClosingDragMode();
        } else {
            this._dragPoints = new C.PointsSpan(
                this.points.point(pointId),
                this.points.point(pointId - 1),
                this.points.point(pointId + 1),
                null);
        }
        this.container.addEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private enableClosingDragMode(): void {
        this._dragPoints = new C.PointsSpan(
            this.points.point(0),
            this.points.point(this.points.length - LINK_MINIMUM_POINTS),
            this.points.point(1),
            this.points.point(this.points.length - 1));
    }

    private enableTranslateMode(): void {
        this.container.addEventListener("mousemove", this.onMouseTranslateListner, false);
    }

    private disableTranslateMode(): void {
        this.container.removeEventListener("mousemove", this.onMouseTranslateListner, false);
        this._lastTranslatePosition = undefined;
    }

//////////////////////// Validation
    public resetValidation(points: Array<Mesh>): void {
        for (let i: number = 0; i < points.length - 1; i++) {
            if (points[i + 1] !== null) {
                (this.scene.getObjectByName(LINE_STR_PREFIX + points[i + 1].id) as Line).material =
                    this.constraintValidator.validateLine(points[i].position, points[i + 1].position)
                        ? C.LINE_MATERIAL : C.LINE_MATERIAL_INVALID;
            }
        }
    }
}
