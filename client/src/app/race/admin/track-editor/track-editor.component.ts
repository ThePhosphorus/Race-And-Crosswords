import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackGenerator } from "../track-generator-service/track-generator.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TrackLoaderService } from "../../track-loader/track-loader.service";
import { Track, Vector3Struct } from "../../../../../../common/communication/track";
import { TrackSaverService } from "../track-saver/track-saver.service";
import { Vector3 } from "three";
import { LINK_MINIMUM_POINTS } from "../track-editor.constants";

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"],
    providers: [TrackGenerator, CameraManagerService]
})
export class TrackEditorComponent implements AfterViewInit {
    public id: string;
    public description: string;
    public name: string;

    @ViewChild("editor")
    private _elem: ElementRef;
    private _previousName: string;

    public constructor(
        public trackGenerator: TrackGenerator,
        private _trackLoader: TrackLoaderService,
        private _trackSaver: TrackSaverService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this._route.params.map((p) => p.id).subscribe((id: string) => {
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
        this.trackGenerator.setContainer(this._elem.nativeElement);
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackGenerator.onResize();
    }

    public onScroll(event: MouseWheelEvent): boolean {
        this.trackGenerator.mouseWheelEvent(event);

        return false;
    }

    public onClick(event: MouseEvent): boolean {
        this.trackGenerator.mouseEventclick(event);

        return false;
    }

    public onClickRelease(event: MouseEvent): void {
        this.trackGenerator.mouseEventReleaseClick(event);
    }

    public removePoint(index: number): void {
        this.trackGenerator.points.removePoint(index);
    }

    public selectPoint(index: number): void {
        this.trackGenerator.points.selectPoint(index);
    }

    private getTrack(id: string): void {
        this._trackLoader.loadOne(id).subscribe((track: Track) => {
            this.name = track.name;
            this._previousName = track.name;
            this.description = track.description;
            this.trackGenerator.loadTrack(track.points.map((value: Vector3Struct) => TrackLoaderService.toVector(value)));
        });
    }

    public saveTrack(): void {
        const points: Vector3[] = this.trackGenerator.saveTrack();
        if (this.testTrack(points)) {
            this._trackSaver.save(
                (this._previousName && this.name === this._previousName) ? this.id : null,
                this.name, this.description, points
                ).subscribe((bool: boolean) => { if (bool) { this._router.navigate(["/admin/tracks"]); } });
        }
    }

    private testTrack(points: Vector3[]): boolean {
        let errMsg: string = "";
        if (points == null) {
            errMsg = "Constrains are not valid";
        } else if (this.name === "") {
            errMsg = "Name is not set";
        } else if (this.trackGenerator.points.length < LINK_MINIMUM_POINTS) {
            errMsg = "There must be at least " + LINK_MINIMUM_POINTS + " points.";
        } else if (!this.trackGenerator.points.points[0]
            .equals(this.trackGenerator.points.points[this.trackGenerator.points.length - 1])) {
            errMsg = "Track must be closed";
        } else {
            return true;
        }
        window.alert(errMsg);

        return false;
    }

    public deleteTrack(): void {
        if (this.id && confirm("Delete track?")) {
            this._trackSaver.delete(this.id).subscribe((bool: boolean) => { if (bool) { this._router.navigate(["/admin/tracks"]); } });
        }
    }
}
