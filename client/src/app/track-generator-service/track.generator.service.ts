import { Injectable } from "@angular/core";
import { TrackRenderer } from "./track.generator.renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Vector2, Mesh, Vector3 } from "three";
import * as C from "./track.constantes";

const FIND_POINT_ERROR: number = -1;

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
        const possiblePointId: number = this.findPointId(new Vector2(event.offsetX, event.offsetY));
        if ( possiblePointId !== FIND_POINT_ERROR) {
            this.selectPoint(possiblePointId);
            console.log("reselect : " + possiblePointId);
        } else {
            this._points.push(this._renderer.createDot(new Vector2(event.offsetX, event.offsetY)));
        }

     }

    private findPointId(pos: Vector2): number {
        for (let i: number = 0; i < this._points.length ; i++ ) {
            const diff: number = this._renderer.getClientPosition(this._points[i].position).sub(pos).length();
            if ( diff <= C.POINT_SELECT_DISTANCE ) {
                return i;
            }
        }

        return FIND_POINT_ERROR;
     }

    public mouseEventReleaseClick(event: MouseEvent): void {
        console.log("mouseEventReleaseClick : ");
        console.log(event);
     }

    public onResize(): void {
        this._renderer.onResize();
     }

    public get points(): {pos: Vector2, selected: boolean}[] {
        const result: {pos: Vector2, selected: boolean}[] = [];
        this._points.forEach((point: Mesh) =>
        result.push({pos: this.toVector2(point.position), selected: point === this._selectedPoint}));

        return result;
     }

    private toVector2(v: Vector3): Vector2 {
        return new Vector2(v.x, v.z);
     }

    public selectPoint( pointId: number): void {
        if (this._selectedPoint != null) {
            this._selectedPoint.material = C.WHITE_MATERIAL;
        }

        this._selectedPoint = this._points[pointId];
        this._selectedPoint.material = C.SELECTION_MATERIAL;
     }
}
