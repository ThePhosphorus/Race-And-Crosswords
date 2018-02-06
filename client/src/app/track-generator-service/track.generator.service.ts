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

    }

    public InputKeyUp(event: KeyboardEvent): void {

    }

    public mouseEventHover(event: MouseEvent): void {

    }

    public mouseEventclick(event: MouseEvent): void {

    }

    public onResize(): void {

    }
}
