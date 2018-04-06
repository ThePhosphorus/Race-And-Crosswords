import { Vector3, GridHelper, Color, AmbientLight, Vector2, Mesh, Geometry, Line, Object3D } from "three";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { Renderer } from "../../renderer/renderer";
import { ConstraintValidator } from "./constraint-validator/constraint-validator";
import { Injectable } from "@angular/core";
import { PointsHandler } from "./points-handler/points-handler";
import { InputManagerService } from "../../input-manager-service/input-manager.service";
import { ZoomLimit } from "../../camera-manager-service/camera-container";
import {
    CameraType,
    AMBIENT_LIGHT_OPACITY,
    WHITE, ZOOM_IN_KEYCODE,
    ZOOM_OUT_KEYCODE,
    DELETE_KEY,
    LEFT_CLICK_CODE,
    MIDDLE_CLICK_CODE,
    RIGHT_CLICK_CODE
} from "../../../global-constants/constants";
import {
    LINK_MINIMUM_POINTS, PointsSpan, ZOOM_FACTOR, GRID_DIMENSION, GRID_DIVISIONS,
    GRID_PRIMARY_COLOR, GRID_SECONDARY_COLOR, STARTING_CAMERA_HEIGHT, WHITE_MATERIAL,
    SPHERE_GEOMETRY, LINE_MATERIAL, POINT_SELECTION_PRECISION, LINE_MATERIAL_INVALID
} from "../track-editor.constants";

const LINE_STR_PREFIX: string = "Line to ";
const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 200;

@Injectable()
export class TrackGenerator extends Renderer {
    public points: PointsHandler;
    private _gridHelper: GridHelper;
    private _dragPoints: PointsSpan;
    private onMouseMoveListner: EventListenerObject;
    private onMouseTranslateListner: EventListenerObject;
    private _translateStartingPosition: Vector3;
    private constraintValidator: ConstraintValidator;

    public constructor(private cameraManager: CameraManagerService, private inputManager: InputManagerService) {
        super(cameraManager, false);
        this.points = new PointsHandler(this);
        this.onMouseMoveListner = this.onMouseMove.bind(this);
        this.onMouseTranslateListner = this.onTranslateCamera.bind(this);
        this.constraintValidator = new ConstraintValidator();
        this.inputManager.resetBindings();
        this.setupKeyBindings();
    }

    public setupKeyBindings(): void {
        this.inputManager.registerKeyDown(ZOOM_IN_KEYCODE, this.cameraManager.zoomIn);
        this.inputManager.registerKeyDown(ZOOM_OUT_KEYCODE, this.cameraManager.zoomOut);

        this.inputManager.registerKeyUp(ZOOM_IN_KEYCODE, this.cameraManager.zoomRelease);
        this.inputManager.registerKeyUp(ZOOM_OUT_KEYCODE, this.cameraManager.zoomRelease);
        this.inputManager.registerKeyUp(DELETE_KEY, this.points.removeSelectedPoint);
    }

    public mouseEventReleaseClick = (event: MouseEvent): void => {
        this.disableDragMode();
        this.disableTranslateMode();
        this.points.updateStartingPosition();
    }

    public mouseEventclick(event: MouseEvent): void {
        if (event.button === LEFT_CLICK_CODE) {
            this.mouseEventLeftClick(event);
        } else if (event.button === MIDDLE_CLICK_CODE) {
            this.mouseEventMiddleClick(event);
        } else if (event.button === RIGHT_CLICK_CODE) {
            this.mouseEventRightClick(event);
        }
    }

    private mouseEventRightClick(event: MouseEvent): void {
        if (this.points.length > 0) {
            this.points.removePoint(this.points.length - 1);
        }
        this.resetValidation();
    }

    private mouseEventLeftClick = (event: MouseEvent): void => {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.points.selectPoint(possiblePointId);
            this.resetValidation();
            this.enableDragMode(possiblePointId);
        } else {
            // Remove connection to spawn point
            if (this.points.length > LINK_MINIMUM_POINTS &&
                this.points.top.position.clone().sub(this.points.point(0).position).length() < 1) {
                this.points.removePoint(this.points.length - 1);
            }

            const newPoint: Mesh = this.createDot(new Vector2(event.offsetX, event.offsetY),
                                                  (this.points.length > 0) ? this.points.top.position : null);

            this.points.push(newPoint);
            this.points.updateStartingPosition();
            this.points.selectPoint(this.points.length - 1);
            this.enableDragMode(this.points.selectedPointId);
            this.resetValidation();
        }
    }

    private mouseEventMiddleClick(event: MouseEvent): void {
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if (possiblePointId !== null) {
            this.points.removePoint(possiblePointId);
            this.resetValidation();
        } else {
            this.enableTranslateMode(event);
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
        this.resetValidation();
    }

    public mouseWheelEvent(event: MouseWheelEvent): void {
        this.cameraManager.scrollZoom(event.deltaY / ZOOM_FACTOR);
    }

    // Rendering
    public setContainer(container: HTMLDivElement): void {
        this.init(container);
        this.startRenderingLoop();
    }

    protected onInit(): void {
        this.cameraManager.cameraType = CameraType.Orthographic;
        this._gridHelper = new GridHelper(
            GRID_DIMENSION,
            GRID_DIVISIONS,
            new Color(GRID_PRIMARY_COLOR),
            new Color(GRID_SECONDARY_COLOR)
        );
        this.scene.add(this._gridHelper);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.cameraManager.cameraDistanceToCar = STARTING_CAMERA_HEIGHT;
        this.cameraManager.zoomLimit = new ZoomLimit(MIN_ZOOM, MAX_ZOOM);
    }

    private onTranslateCamera(event: MouseEvent): void {
        const newPoint: Vector2 = new Vector2(event.offsetX, event.offsetY);
        const relativePoint: Vector3 = this.getDistanceCenterScreen(newPoint);
        this.cameraTargetPosition.copy(this._translateStartingPosition.clone().sub(relativePoint));
    }

    // ThreeJs object handeling
    public createDot(pos: Vector2, topMesh: Vector3, pos3?: Vector3): Mesh {
        const circle: Mesh = new Mesh(SPHERE_GEOMETRY, WHITE_MATERIAL);
        circle.position.copy((pos3) ? pos3 : this.getRelativePosition(pos));
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
        const line: Line = new Line(lineG, LINE_MATERIAL);
        line.name = LINE_STR_PREFIX + id;
        this.scene.add(line);
    }

    private findPointId(pos: Vector2): number {
        for (let i: number = this.points.length - 1; i >= 0; i--) {
            const diff: number = this.getClientPosition(this.points.point(i).position).sub(pos).length();
            if (diff <= POINT_SELECTION_PRECISION) {
                return i;
            }
        }

        return null;
    }

    // Event functions
    public disableDragMode(): void {
        this.container.removeEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private enableDragMode(pointId: number): void {
        if ((pointId === this.points.length - 1 || pointId === 0) && this.points.top.position.equals(this.points.point(0).position)) {
            this.enableClosingDragMode();
        } else {
            this._dragPoints = new PointsSpan(
                this.points.point(pointId),
                (pointId === 0) ? null : this.points.point(pointId - 1),
                (pointId === this.points.length - 1) ? null : this.points.point(pointId + 1),
                null);
        }
        this.container.addEventListener("mousemove", this.onMouseMoveListner, false);
    }

    private enableClosingDragMode(): void {
        this._dragPoints = new PointsSpan(
            this.points.point(0),
            (this.points.length >= LINK_MINIMUM_POINTS) ? this.points.point(this.points.length - LINK_MINIMUM_POINTS) : null,
            (this.points.length > 1) ? this.points.point(1) : null,
            this.points.point(this.points.length - 1));
    }

    private enableTranslateMode(event: MouseEvent): void {
        this._translateStartingPosition = this.getRelativePosition(new Vector2(event.offsetX, event.offsetY));
        this.container.addEventListener("mousemove", this.onMouseTranslateListner, false);

    }

    private disableTranslateMode(): void {
        this.container.removeEventListener("mousemove", this.onMouseTranslateListner, false);
    }

    // Validation
    public resetValidation(): boolean {
        let valid: boolean = true;
        this.constraintValidator.points = this.points.points;
        for (let i: number = 0; i < this.points.points.length - 1; i++) {
            if (this.points.points[i + 1] !== null) {
                if (this.constraintValidator.validateLine(this.points.points[i], this.points.points[i + 1])) {
                    (this.scene.getObjectByName(LINE_STR_PREFIX + this.points.point(i + 1).id) as Line).material = LINE_MATERIAL;
                } else {
                    (this.scene.getObjectByName(LINE_STR_PREFIX + this.points.point(i + 1).id) as Line).material = LINE_MATERIAL_INVALID;
                    valid = false;
                }
            }
        }

        return valid;
    }

    public loadTrack(points: Vector3[]): void {
        points.forEach((point: Vector3) => {
            const topPosition: Vector3 = (this.points.length > 0) ? this.points.top.position : null;
            this.points.push(this.createDot(null, topPosition, point));
            this.points.updateStartingPosition();
            this.resetValidation();
        });
    }

    public saveTrack(): Vector3[] {
        return (this.resetValidation()) ? this.points.points : null;
    }
}
