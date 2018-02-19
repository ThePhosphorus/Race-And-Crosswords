import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackGenerator } from "../track-generator-service/track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { PosSelect } from "../track-generator-service/track.constantes";
import { ActivatedRoute, Router } from "@angular/router";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track, Vector3Struct } from "../../../../common/communication/track";
import { TrackSaverService } from "../track-saver/track-saver.service";
import { Vector3 } from "three";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"],
    providers: [TrackGenerator, CameraManagerService]
})
export class TrackEditorComponent implements AfterViewInit {
    @ViewChild("editor")
    private elem: ElementRef;
    public points: PosSelect[];
    public id: string;
    public description: string;
    public name: string;

    public constructor(
        private trackRenderer: TrackGenerator,
        private trackLoader: TrackLoaderService,
        private trackSaver: TrackSaverService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.points = [];
        this.route.params.map((p) => p.id).subscribe((id: string) => {
            if (id) {
                this.id = id;
                this.getTrack(id);
            } else {
                this.name = "";
                this.description = "";
            }
        });
     }

    public ngAfterViewInit(): void {
        this.trackRenderer.setContainer(this.elem.nativeElement);
        this.points = this.trackRenderer.points.PositionSelectPoints;
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

    @HostListener("window:wheel", ["$event"])
    public onScroll(event: MouseWheelEvent): void {
        this.trackRenderer.mouseWheelEvent(event);
    }

    public onClick(event: MouseEvent): void {
        this.trackRenderer.mouseEventclick(event);
     }

    public onClickRelease(event: MouseEvent): void {
        this.trackRenderer.mouseEventReleaseClick(event);
        this.update();
     }

    public removePoint(index: number): void {
        this.trackRenderer.points.removePoint(index);
        this.update();
     }

    public selectPoint(index: number): void {
        this.trackRenderer.points.selectPoint(index);
        this.update();
     }

    private update(): void {
        this.points = this.trackRenderer.points.PositionSelectPoints;
     }

    private getTrack(id: string): void {
        this.trackLoader.loadOne(id).subscribe((track: Track) => {
            this.name = track.name;
            this.description = track.description;
            this.trackRenderer.loadTrack(track.points.map((value: Vector3Struct) => this.trackLoader.toVector(value)));
            this.update();
        });
    }

    public saveTrack(): void {
        const points: Vector3[] = this.trackRenderer.saveTrack();
        if (points != null && this.name !== "" &&
            this.points.length > 2 && this.points[0].pos.equals(this.points[this.points.length - 1].pos)) {
            this.trackSaver.save(this.id, this.name, this.description, points)
                .subscribe((bool: boolean) => {if (bool) { this.router.navigate(["/admin/track-list"]); } });
        } else {
            window.alert("Not all constraints are respected");
        }
    }

    public deleteTrack(): void {
        this.trackSaver.delete(this.id).subscribe((bool: boolean) => {if (bool) { this.router.navigate(["/admin/track-list"]); } });
    }
}
