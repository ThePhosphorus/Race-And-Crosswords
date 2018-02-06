import { Injectable } from "@angular/core";
import { TrackRenderer } from "./track.generator.renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { Vector2 } from "three";

@Injectable()
export class TrackGeneratorService {
    private _renderer: TrackRenderer;

    public constructor(private cameraService: CameraManagerService) {
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
        this._renderer.createDot(new Vector2(event.clientX, event.clientY));
    }

    public mouseEventReleaseClick(event: MouseEvent): void {
        console.log("mouseEventReleaseClick : ");
        console.log(event);
    }

    public onResize(): void {
        this._renderer.onResize();
    }
}
