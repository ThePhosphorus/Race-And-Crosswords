import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackRenderer } from "../track-generator-service/track.generator.renderer";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";
import { PosSelect } from "../track-generator-service/track.constantes";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"],
    providers: [TrackRenderer, CameraManagerService, ConstraintValidatorService]
})
export class TrackEditorComponent implements AfterViewInit {
    @ViewChild("editor")
    private elem: ElementRef;
    public points: PosSelect[];

    public constructor(private trackRenderer: TrackRenderer) {
        this.points = [];
     }

    public ngAfterViewInit(): void {
        this.trackRenderer.setContainer(this.elem.nativeElement);
        this.points = this.trackRenderer.points;
     }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackRenderer.onResize();
     }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.trackRenderer.InputKeyDown(event);
     }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.trackRenderer.InputKeyUp(event);
     }

    public onClick(event: MouseEvent): void {
        this.trackRenderer.mouseEventclick(event);
     }

    public onClickRelease(event: MouseEvent): void {
        this.trackRenderer.mouseEventReleaseClick(event);
        this.update();
     }

    public removePoint(index: number): void {
        this.trackRenderer.removePoint(index);
        this.update();
     }

    public selectPoint(index: number): void {
        this.trackRenderer.selectPoint(index);
        this.update();
     }

    private update(): void {
        this.points = this.trackRenderer.points;
     }

}
