import { Injectable } from "@angular/core";
import { TrackRenderer } from "./track.generator.renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

@Injectable()
export class TrackGeneratorService {
    private _renderer: TrackRenderer;

    public constructor(private cameraService: CameraManagerService) {
     }

    public init(div: HTMLDivElement): void {
       this._renderer = new TrackRenderer(div, this.cameraService);
     }

    public InputkeyDown(event: KeyboardEvent): void {
        console.log("InputKeyDown : ");
        console.log(event);
    }

    public InputKeyUp(event: KeyboardEvent): void {
        console.log("InputKeyUp : ");
        console.log(event);
    }

    public mouseEventHover(event: MouseEvent): void {
        console.log("mouseEventHover : ");
        console.log(event);
    }

    public mouseEventclick(event: MouseEvent): void {
        console.log("mouseEventClick : ");
        console.log(event);
    }

    public mouseEventReleaseClick(event: MouseEvent): void {
        console.log("mouseEventReleaseClick : ");
        console.log(event);
    }

    public onResize(): void {
        console.log("onResize : ");
    }
}
