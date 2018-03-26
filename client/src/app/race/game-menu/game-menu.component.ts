import { Component, ElementRef, ViewChild, AfterViewInit, AfterContentChecked } from "@angular/core";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track } from "../../../../../common/race/track";
import { TrackPreviewService } from "./track-preview/track-preview.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

@Component({
    selector: "app-game-menu",
    templateUrl: "./game-menu.component.html",
    styleUrls: ["./game-menu.component.css"],
    providers: [TrackLoaderService, TrackPreviewService, CameraManagerService]
})
export class GameMenuComponent implements AfterViewInit, AfterContentChecked {

    public tracks: Array<Track>;
    public openedTrack: Track;
    public hasDetailsOpen: boolean;

    @ViewChild("preview")
    private _preview: ElementRef;

    public constructor(private _trackLoader: TrackLoaderService, private trackPreview: TrackPreviewService) {
        this.tracks = new Array<Track>();
        this._trackLoader.loadAll().subscribe((ts: Track[]) => this.tracks = ts);
        this.hasDetailsOpen = false;
    }

    public ngAfterContentChecked(): void {
        if (this.hasDetailsOpen) {
            this.trackPreview.onResize();
        }
    }

    public ngAfterViewInit(): void {
        this.trackPreview.init(this._preview.nativeElement);
        this.trackPreview.startRenderingLoop();
    }

    public open(track: Track): void {
        this.openedTrack = track;
        this.hasDetailsOpen = true;
        this.trackPreview.displayPreview(track);
    }

    public close(): void {
        this.openedTrack = null;
        this.hasDetailsOpen = false;
        this.trackPreview.resetDisplay();
    }

}
