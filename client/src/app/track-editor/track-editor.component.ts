import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from "@angular/core";
import { TrackGenerator, LINK_MINIMUM_POINTS } from "../track-generator-service/track-generator.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
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
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.trackRenderer.onResize();
    }

    public onScroll(event: MouseWheelEvent): boolean {
        this.trackRenderer.mouseWheelEvent(event);

        return false;
    }

    public onClick(event: MouseEvent): boolean {
        this.trackRenderer.mouseEventclick(event);

        return false;
    }

    public onClickRelease(event: MouseEvent): void {
        this.trackRenderer.mouseEventReleaseClick(event);
    }

    public removePoint(index: number): void {
        this.trackRenderer.points.removePoint(index);
    }

    public selectPoint(index: number): void {
        this.trackRenderer.points.selectPoint(index);
    }

    private getTrack(id: string): void {
        this.trackLoader.loadOne(id).subscribe((track: Track) => {
            this.name = track.name;
            this.description = track.description;
            this.trackRenderer.loadTrack(track.points.map((value: Vector3Struct) => this.trackLoader.toVector(value)));
        });
    }

    public saveTrack(): void {
        const points: Vector3[] = this.trackRenderer.saveTrack();
        if (this.testTrack(points)) {
            this.trackSaver.save(this.id, this.name, this.description, points)
                .subscribe((bool: boolean) => { if (bool) { this.router.navigate(["/admin/tracks"]); } });
        }
    }

    private testTrack(points: Vector3[]): boolean {
        let errMsg: string = "";
        if (points == null) {
            errMsg = "Constrains are not valid";
        } else if (this.name === "") {
            errMsg = "Name is not set";
        } else if (this.trackRenderer.points.length < LINK_MINIMUM_POINTS) {
            errMsg = "There must be at least " + LINK_MINIMUM_POINTS + " points.";
        } else if (!this.trackRenderer.points.points[0]
            .equals(this.trackRenderer.points.points[this.trackRenderer.points.length - 1])) {
            errMsg = "Track must be closed";
        } else {
            return true;
        }
        window.alert(errMsg);

        return false;
    }

    public deleteTrack(): void {
        if (this.id && confirm("Delete track?")) {
            this.trackSaver.delete(this.id).subscribe((bool: boolean) => { if (bool) { this.router.navigate(["/admin/tracks"]); } });
        }
    }
}
