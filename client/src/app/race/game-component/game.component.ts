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
import { GameConfiguration } from "./game-configuration/game-configuration";
import { LoaderService } from "./loader-service/loader.service";

const FULLSCREEN_KEYCODE: number = 70; // F
const EMPTY_TRACK_ID: string = "empty";

const LOADING_TITLE: string = "Getting the track";
const LOADING_DESCRIPTION: string = "Getting the track from the server";

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
        LightManagerService,
        LoaderService
    ]
})
export class GameComponent implements OnDestroy, AfterViewInit {

    private containerRef: ElementRef;

    public track: Track;
    public isLoading: boolean;

    public constructor(
        private _gameManagerService: GameManagerService,
        private _soundManager: SoundManagerService,
        private _trackLoader: TrackLoaderService,
        private _route: ActivatedRoute,
        private _inputManager: InputManagerService,
        private _loader: LoaderService
    ) {
        this._loader.isFinished.subscribe((finished: boolean) => {
            this.isLoading = !finished;
        });
        this.isLoading = true;
        this.track = new Track("", LOADING_TITLE, LOADING_DESCRIPTION, [], 0, [] );
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        if (!this.isLoading) {
            this._gameManagerService.onResize();
        }
    }

    @ViewChild("container") public set container(el: ElementRef) {
        if (el != null) {
            this.containerRef = el;
            if (!this.isLoading) {
                this.finishedLoading();
            }
        }
    }

    public ngAfterViewInit(): void {
        this._inputManager.resetBindings();
        this._inputManager.registerKeyDown(FULLSCREEN_KEYCODE, () => this.fullscreen());
        this._route.params.map((p) => p.id).subscribe((id: string) => this.loadTrack(id));
    }

    public get carInfos(): CarInfos {
        return this._gameManagerService.playerInfos;
    }

    public ngOnDestroy(): void {
        this._soundManager.stopAllSounds();
    }

    private loadTrack(id: string): void {
        if (id != null && id !== EMPTY_TRACK_ID) {
            this._trackLoader.loadOne(id).subscribe((track: Track) => {
                this.track = track;
            });
        }
    }

    private fullscreen(): void {
        this.containerRef.nativeElement.webkitRequestFullscreen();
        this.onResize();
    }

    private finishedLoading(): void {
        if (this.track != null && this.track._id !== "") {
            const gameConfig: GameConfiguration = new GameConfiguration(this.track,
                                                                        this._trackLoader.getTrackMeshs(this.track),
                                                                        this._trackLoader.getTrackWalls(this.track));
            this._gameManagerService.start(this.containerRef.nativeElement, gameConfig);
            this._trackLoader.playTrack(this.track._id).subscribe();
        } else {
            this._gameManagerService.start(this.containerRef.nativeElement, new GameConfiguration());
        }
        this.onResize();
    }
}
