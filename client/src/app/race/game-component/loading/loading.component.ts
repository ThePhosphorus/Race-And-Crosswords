import { Component, Input, ViewChild, AfterViewInit, ElementRef, HostListener, SimpleChanges, OnChanges, OnDestroy } from "@angular/core";
import { Track } from "../../../../../../common/race/track";
import { LoaderService } from "../loader-service/loader.service";
import { TrackPreviewService } from "../../track-preview/track-preview.service";
import { CameraManagerService } from "../../camera-manager-service/camera-manager.service";
import { HALF } from "../../../global-constants/constants";

const DEFAULT_LOADING_MESSAGE: string = "Preparing the loading";

@Component({
    selector: "app-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.css"],
    providers: [TrackPreviewService, CameraManagerService]
})
export class LoadingComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() public track: Track;

    public loadingMessage: string;
    public loadingStatus: number;

    @ViewChild("preview") private _preview: ElementRef;

    public constructor(
        private _loader: LoaderService,
        private _trackPreview: TrackPreviewService
    ) {
        this.loadingMessage = DEFAULT_LOADING_MESSAGE;
        this.loadingStatus = 0;

        this._loader.status.subscribe((status: number) => this.loadingStatus = status);
        this._loader.loadingMsg.subscribe((msg: string) => this.loadingMessage = msg);
        this._loader.startLoading(); // Ask randy no to use texutres in the preview
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
        for (const propName in changes) {
            if ( changes[propName].currentValue === this.track && this.track.id !== "" && this.loadingStatus > HALF) {
                this._trackPreview.displayPreview(this.track);
                this._trackPreview.onResize();
            }
        }
    }

    public ngOnDestroy(): void {
        this._trackPreview.unload();
        this._trackPreview = null;
    }
}
