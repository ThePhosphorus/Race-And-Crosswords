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
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";
import { Injectable } from "@angular/core";

const LINE_STR_PREFIX: string = "Line to ";

const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 100;
const HALF: number = 0.5;
const DOUBLE: number = 2;
const LEFT_CLICK_CODE: number = 0;
const RIGHT_CLICK_CODE: number = 2;
const LINK_MINIMUM_POINTS: number = 2;

@Injectable()
export class TrackGenerator extends Renderer {
    private _cameraPosition: Vector3;
    private _cameraDirection: Vector3;
    private _gridHelper: GridHelper;
    private _dragPoints: C.PointsSpan;
    private onMouseMoveListner: EventListenerObject;
    private _points: Array<Mesh>;
    private _selectedPoint: Mesh;

    public constructor(private cameraManager: CameraManagerService,
                       private constraintValidator: ConstraintValidatorService) {
        super(cameraManager, false);
        this._points = new Array<Mesh>();
        this.constraintValidator.setPoints(this._points);
        this.onMouseMoveListner = this.onMouseMove.bind(this);
    }

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
        this.cameraManager.update(timeSinceLastFrame);
    }

    public InputKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ZOOM_IN_KEYCODE:
                this.cameraManager.zoomIn();
                break;
            case ZOOM_OUT_KEYCODE:
                this.cameraManager.zoomOut();
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
        if (event.button === LEFT_CLICK_CODE) { // LEFT CLICK
            this.mouseEventLeftClick(event);
        } else if (event.button === RIGHT_CLICK_CODE) { // RIGHT CLICK
            this.mouseEventRightClick(event);
        }
    }

    public mouseEventReleaseClick(event: MouseEvent): void {
        this.disableDragMode();
        this.updateStartingPosition();
        this.resetValidation(this._points);
    }

    public get points(): C.PosSelect[] {
        const result: C.PosSelect[] = [];
        this._points.forEach((point: Mesh) =>
            result.push(new C.PosSelect(this.toVector2(point.position), point === this._selectedPoint)));

        return result;
    }

    private toVector2(v: Vector3): Vector2 {
        return new Vector2(v.x, v.z);
    }

    public selectPoint(pointId: number): void {
        if (this._selectedPoint != null && this._selectedPoint !== this._points[0]) {
            this._selectedPoint.material = C.WHITE_MATERIAL;
        }

        this._selectedPoint = this._points[pointId];
        this._selectedPoint.material = C.SELECTION_MATERIAL;

        if (pointId === 0 && !this.topPointPosition.equals(this._points[0].position)) {
            this.closeLoop();
        }

        if ((pointId === this._points.length - 1 || pointId === 0) && this.topPointPosition.equals(this._points[0].position)) {
            this.enableClosingDragMode();
        } else {
            this.enableDragMode(pointId);
        }
    }

    private closeLoop(): void {
        this._points.push(this.createDot(
            this.getClientPosition(this._points[0].position),
            this.topPointPosition));
    }

    public createDot(pos: Vector2, topMesh: Vector3): Mesh {
        const circle: Mesh = new Mesh(C.SPHERE_GEOMETRY, C.WHITE_MATERIAL);
        circle.position.copy(this.getRelativePosition(pos));
        if (topMesh) { this.createLine(topMesh, circle.position, circle.id); }
        this.scene.add(circle);
        this.disableDragMode();

        return circle;
    }

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
            clientClickPos.x * cameraClientRatio.x,
            C.LINE_Y_POSITION,
            clientClickPos.y * cameraClientRatio.y
        );
    }

    public getClientPosition(pos: Vector3): Vector2 {
        const htmlElem: HTMLCanvasElement = this.renderer.domElement;

        const cameraClientRatio: Vector2 = new Vector2(
            DOUBLE * this.cameraManager.cameraDistanceToCar * this.getAspectRatio() / htmlElem.clientWidth,
            DOUBLE * this.cameraManager.cameraDistanceToCar / htmlElem.clientHeight
        );

        const clientClickPos: Vector2 = new Vector2(
            pos.x / cameraClientRatio.x,
            pos.z / cameraClientRatio.y
        );

        return new Vector2(
            clientClickPos.x + HALF * htmlElem.clientWidth,
            clientClickPos.y + HALF * htmlElem.clientHeight
        );
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

        if (before != null && after != null) {
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

    public disableDragMode(): void {
        this.container.removeEventListener("mousemove", this.onMouseMoveListner, false);
    }

    public resetValidation(points: Array<Mesh>): void {
        for (let i: number = 0; i < points.length - 1; i++) {
            if (points[i + 1] !== null) {
                (this.scene.getObjectByName(LINE_STR_PREFIX + points[i + 1].id) as Line).material =
                    this.constraintValidator.validateLine(points[i].position, points[i + 1].position)
                        ? C.LINE_MATERIAL : C.LINE_MATERIAL_INVALID;
            }
        }
    }

    private createLine(from: Vector3, to: Vector3, id: number): void {
        const lineG: Geometry = new Geometry();
        lineG.vertices.push(from, to);
        const line: Line = new Line(lineG, this.constraintValidator.validateLine(from, to) ? C.LINE_MATERIAL : C.LINE_MATERIAL_INVALID);
        line.name = LINE_STR_PREFIX + id;
        this.scene.add(line);
    }

    public removePoint(index: number): void {
        this.removeObject(this._points[index], this._points[index - 1], this._points[index + 1]);
        this._points.splice(index, 1);
    }

    public get topPointPosition(): Vector3 {
        return (this._points.length) ? this._points[this._points.length - 1].position : null;
    }

    public updateStartingPosition(): void {
        this._points[0].material = C.START_POINT_MATERIAL;
    }

    private mouseEventRightClick(event: MouseEvent): void {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.removePoint(possiblePointId);
        }
    }

    private mouseEventLeftClick(event: MouseEvent): void {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.selectPoint(possiblePointId);
        } else {
            // Remove connection to spawn point
            if (this._points.length > LINK_MINIMUM_POINTS && this.topPointPosition.clone().sub(this._points[0].position).length() < 1) {
                this.removePoint(this._points.length - 1);
            }

            const newPoint: Mesh = this.createDot(new Vector2(event.offsetX, event.offsetY), this.topPointPosition);
            this._points.push(newPoint);
            this.updateStartingPosition();
            this.selectPoint(this._points.length - 1);
        }
    }

    private enableDragMode(pointId: number): void {
        this._dragPoints = new C.PointsSpan(
            this._points[pointId],
            this._points[pointId - 1],
            this._points[pointId + 1],
            null);
        this.container.addEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private enableClosingDragMode(): void {
        this._dragPoints = new C.PointsSpan(
            this._points[0],
            this._points[this._points.length - LINK_MINIMUM_POINTS],
            this._points[1],
            this._points[this._points.length - 1]);
        this.container.addEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private findPointId(pos: Vector2): number {
        for (let i: number = this._points.length - 1; i >= 0; i--) {
            const diff: number = this.getClientPosition(this._points[i].position).sub(pos).length();
            if (diff <= C.POINT_SELECT_DISTANCE) {
                return i;
            }
        }

        return null;
    }
}
