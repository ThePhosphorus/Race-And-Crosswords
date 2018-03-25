import { Component, ElementRef, ViewChild, HostListener, OnDestroy, AfterViewInit } from "@angular/core";
import { GameManagerService, CarInfos } from "./game-manager-service/game_manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "./sound-manager-service/sound-manager.service";
import { CollisionDetectorService } from "./collision/collision-detector.service";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { ActivatedRoute } from "@angular/router";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track } from "../../../../../common/race/track";
import { LightManagerService } from "./light-manager/light-manager.service";

const FULLSCREEN_KEYCODE: number = 70; // F
const EMPTY_TRACK_ID: string = "empty";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        GameManagerService,
        CameraManagerService,
        SoundManagerService,
        CollisionDetectorService,
        TrackLoaderService,
        LightManagerService
    ]
})
export class GameComponent implements OnDestroy, AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    public tracks: Track[];

    public constructor(
        private _gameManagerService: GameManagerService,
        private _soundManager: SoundManagerService,
        private _trackLoader: TrackLoaderService,
        private _route: ActivatedRoute,
        private _inputManager: InputManagerService) {
            this._route.params.map((p) => p.id).subscribe((id: string) => {
                if (id != null && id !== EMPTY_TRACK_ID) {
                    this.loadTrack(id);
                }
            });
        }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._gameManagerService.onResize();
    }

    public ngAfterViewInit(): void {
        this._inputManager.resetBindings();
        this._inputManager.registerKeyDown(FULLSCREEN_KEYCODE, () => this.fullscreen());
        this._gameManagerService.start(this.containerRef.nativeElement);
    }

    public get carInfos(): CarInfos {
        return this._gameManagerService.playerInfos;
    }

    public ngOnDestroy(): void {
        this._soundManager.stopAllSounds();
    }

    private loadTrack(id: string): void {
        this._trackLoader.loadOne(id).subscribe((track: Track) =>
            this._gameManagerService.importTrack(TrackLoaderService.getTrackMeshs(track), TrackLoaderService.getTrackWalls(track)));
        this._trackLoader.playTrack(id).subscribe();
    }

    private fullscreen(): void {
        this.containerRef.nativeElement.webkitRequestFullscreen();
        this.onResize();
    }
}
