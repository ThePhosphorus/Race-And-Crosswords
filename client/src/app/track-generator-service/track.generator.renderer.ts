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

const LINE_STR_PREFIX: string = "Line to ";

const MIN_ZOOM: number = 10;
const MAX_ZOOM: number = 100;

const HALF: number = 0.5;
const DOUBLE: number = 2;

export class PointsSpan {
    public constructor(
        public point: Mesh,
        public before: Mesh,
        public after: Mesh,
        public closingPoint: Mesh
    ) { }
}

export class TrackRenderer extends Renderer {
    private _cameraPosition: Vector3;
    private _cameraDirection: Vector3;
    private _gridHelper: GridHelper;
    private _dragPoints: PointsSpan;
    private onMouseMoveListner: EventListenerObject;

    public constructor(container: HTMLDivElement, private cameraManager: CameraManagerService) {
        super(cameraManager, false);
        this.init(container);
        this.startRenderingLoop();
        this.onMouseMoveListner = this.onMouseMove.bind(this);
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

    public createDot(pos: Vector2, topMesh: Vector3): Mesh {
        const circle: Mesh = new Mesh(C.SPHERE_GEOMETRY, C.WHITE_MATERIAL);
        circle.position.copy(this.getRelativePosition(pos));
        if (topMesh) { this.createLine(topMesh, circle.position, circle.id); }
        this.scene.add(circle);

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

    public enableDragMode(point: Mesh, before?: Mesh, after?: Mesh, closingPoint?: Mesh): void {
        this._dragPoints = new PointsSpan(point, before, after, closingPoint);
        this.container.addEventListener("mousemove", this.onMouseMoveListner, false);
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

    private createLine(from: Vector3, to: Vector3, id: number): void {
        const lineG: Geometry = new Geometry();
        lineG.vertices.push(from, to);
        const line: Line = new Line(lineG, C.LINE_MATERIAL);
        line.name = LINE_STR_PREFIX + id;
        this.scene.add(line);
    }
}
