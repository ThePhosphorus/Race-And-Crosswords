import { Component, ElementRef, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { GameManagerService, CarInfos } from "./game-manager-service/game_manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "./sound-manager-service/sound-manager.service";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track } from "../../../../../common/communication/track";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        GameManagerService,
        CameraManagerService,
        SoundManagerService,
        TrackLoaderService
            ]
})

export class GameComponent implements OnDestroy {

    @ViewChild("container")
    private containerRef: ElementRef;
    public tracks: Track[];
    public isInitialized: boolean = false;

    public constructor(
        private gameManagerService: GameManagerService,
        private soundManager: SoundManagerService,
        private trackLoader: TrackLoaderService) {
            this.trackLoader.loadAll().subscribe((ts: Track[]) => this.tracks = ts);
        }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.gameManagerService.onResize();
    }

    public init(id: string): void {
        this.isInitialized = true;
        this.gameManagerService
            .initialize(this.containerRef.nativeElement)
            .then(() => this.loadTrack(id))
            .catch((err) => console.error(err));
    }

    public get carInfos(): CarInfos {
        return this.gameManagerService.carInfos;
    }

    public ngOnDestroy(): void {
        this.soundManager.stopAllSounds();
    }

    private loadTrack(id: string): void {
        this.trackLoader.loadOne(id).subscribe((track: Track) =>
            this.gameManagerService.importTrack(TrackLoaderService.getTrackMeshs(track)));
    }
}
