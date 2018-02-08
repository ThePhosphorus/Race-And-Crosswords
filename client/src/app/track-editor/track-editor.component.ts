import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackGeneratorService, PosSelect } from "../track-generator-service/track.generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { ConstraintValidatorService } from "../constraint-validator/constraint-validator.service";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"],
    providers: [TrackGeneratorService, CameraManagerService, ConstraintValidatorService]
})
export class TrackEditorComponent implements AfterViewInit {
    @ViewChild("editor")
    private elem: ElementRef;
    public points: PosSelect[];

    public constructor(private trackGen: TrackGeneratorService) {
        this.points = [];
     }

    public ngAfterViewInit(): void {
        this.trackGen.init(this.elem.nativeElement);
        this.points = this.trackGen.points;
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

    public onClick(event: MouseEvent): void {
        this.trackGen.mouseEventclick(event);
     }

    public onClickRelease(event: MouseEvent): void {
        this.trackGen.mouseEventReleaseClick(event);
        this.update();
     }

    public removePoint(index: number): void {
        this.trackGen.removePoint(index);
        this.update();
     }

    public selectPoint(index: number): void {
        this.trackGen.selectPoint(index);
        this.update();
     }

    private update(): void {
        this.points = this.trackGen.points;
     }

}
