import { Injectable } from "@angular/core";
import { TrackRenderer } from "./track.generator.renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Vector2, Mesh, Vector3 } from "three";
import * as C from "./track.constantes";
import { ConstraintValidator } from "./constraint-validator";

const LEFT_CLICK_CODE: number = 0;
const RIGHT_CLICK_CODE: number = 2;
const LINK_MINIMUM_POINTS: number = 2;

export class PosSelect {
    public constructor(
        public pos: Vector2,
        public selected: boolean
    ) { }
}

@Injectable()
export class TrackGeneratorService {
    private _renderer: TrackRenderer;
    private _points: Array<Mesh>;
    private _selectedPoint: Mesh;

    public constructor(private cameraService: CameraManagerService) {
        this._points = new Array<Mesh>();
    }

    public init(div: HTMLDivElement): void {
        this._renderer = new TrackRenderer(div, this.cameraService);
    }

    public InputkeyDown(event: KeyboardEvent): void {
        this._renderer.InputKeyDown(event);
    }

    public InputKeyUp(event: KeyboardEvent): void {
        this._renderer.InputKeyUp(event);
    }

    public mouseEventclick(event: MouseEvent): void {
        if (event.button === LEFT_CLICK_CODE) { // LEFT CLICK
            this.mouseEventLeftClick(event);
        } else if (event.button === RIGHT_CLICK_CODE) { // RIGHT CLICK
            this.mouseEventRightClick(event);
        }
    }

    public mouseEventReleaseClick(event: MouseEvent): void {
        this._renderer.disableDragMode();
    }

    public onResize(): void {
        this._renderer.onResize();
    }

    public get points(): PosSelect[] {
        const result: PosSelect[] = [];
        this._points.forEach((point: Mesh) =>
            result.push(new PosSelect(this.toVector2(point.position), point === this._selectedPoint)));

        return result;
    }

    private toVector2(v: Vector3): Vector2 {
        return new Vector2(v.x, v.z);
    }

    public selectPoint(pointId: number): void {
        if (this._selectedPoint != null) {
            this._selectedPoint.material = C.WHITE_MATERIAL;
        }

        if (pointId === 0 && this.topPointPosition !== this._points[0].position) {
            this._points.push(this._renderer.createDot(
                this._renderer.getClientPosition(this._points[0].position),
                this.topPointPosition));

            return;
        }

        this._selectedPoint = this._points[pointId];
        this._selectedPoint.material = C.SELECTION_MATERIAL;
    }

    public removePoint(index: number): void {
        this._renderer.removeObject(this._points[index], this._points[index - 1], this._points[index + 1]);
        this._points.splice(index, 1);
        this.updateStartingPosition();
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
            this._renderer.enableDragMode(
                this._points[possiblePointId],
                this._points[possiblePointId - 1],
                this._points[possiblePointId + 1]);
        } else {
            // Remove connection to spawn point
            if (this._points.length > LINK_MINIMUM_POINTS && this.topPointPosition.clone().sub(this._points[0].position).length() < 1) {
                this.removePoint(this._points.length - 1);
            }

            const newPoint: Mesh = this._renderer.createDot(new Vector2(event.offsetX, event.offsetY), this.topPointPosition);
            this._points.push(newPoint);
            this.updateStartingPosition();
            // this.selectPoint(this._points.length - 1);
        }
    }

    private findPointId(pos: Vector2): number {
        for (let i: number = 0; i < this._points.length; i++) {
            const diff: number = this._renderer.getClientPosition(this._points[i].position).sub(pos).length();
            if (diff <= C.POINT_SELECT_DISTANCE) {
                return i;
            }
        }

        return null;
    }
}
