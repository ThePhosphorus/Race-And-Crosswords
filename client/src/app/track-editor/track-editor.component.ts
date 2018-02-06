import { Component, ElementRef, HostListener } from "@angular/core";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { ViewChild } from "@angular/core/src/metadata/di";
import { TrackGeneratorService } from "../track-generator-service/track.generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

@Component({
  selector: "app-track-editor",
  templateUrl: "./track-editor.component.html",
  styleUrls: ["./track-editor.component.css"],
  providers: [TrackGeneratorService, CameraManagerService]
})
export class TrackEditorComponent implements AfterViewInit {
    @ViewChild("editor")
    private elem: ElementRef;

    public constructor(private trackGen: TrackGeneratorService) { }

    public ngAfterViewInit(): void {
        this.trackGen.init(this.elem.nativeElement);
     }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackGen.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
    this.trackGen.InputkeyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
    this.trackGen.InputKeyUp(event);
    }

}
