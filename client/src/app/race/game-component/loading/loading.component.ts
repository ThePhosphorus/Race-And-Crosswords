import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, HostListener, SimpleChanges, OnChanges } from "@angular/core";
import { Track } from "../../../../../../common/race/track";
import { LoaderService } from "../loader-service/loader.service";
import { TrackPreviewService } from "../../track-preview/track-preview.service";

@Component({
    selector: "app-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.css"],
    providers: [TrackPreviewService]
})
export class LoadingComponent implements AfterViewInit, OnChanges {
    @Input() public track: Track;

    @ViewChild("preview") private _preview: ElementRef;

    public constructor(
        private _loader: LoaderService,
        private _trackPreview: TrackPreviewService
    ) {
        this._loader.startLoading();
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._trackPreview.onResize();
    }

    public ngAfterViewInit(): void {
        this._trackPreview.init(this._preview.nativeElement);
        this._trackPreview.startRenderingLoop();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.track._id !== "") {
            this._trackPreview.displayPreview(this.track);
        }
    }
}
