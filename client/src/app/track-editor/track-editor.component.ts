import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackGenerator } from "../track-generator-service/track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { PosSelect } from "../track-generator-service/track.constantes";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"],
    providers: [TrackGenerator, CameraManagerService]
})
export class TrackEditorComponent implements AfterViewInit {
    @ViewChild("editor")
    private elem: ElementRef;

    public constructor(private trackRenderer: TrackGenerator) {}

    public ngAfterViewInit(): void {
        this.trackRenderer.setContainer(this.elem.nativeElement);
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackRenderer.onResize();
    }

    @HostListener("window:wheel", ["$event"])
    public onScroll(event: MouseWheelEvent): void {
        this.trackRenderer.mouseWheelEvent(event);
    }

    public removePoint(index: number): void {
        this.trackRenderer.points.removePoint(index);
    }

    public selectPoint(index: number): void {
        this.trackRenderer.points.selectPoint(index);
    }
}
