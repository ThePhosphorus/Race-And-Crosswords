import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnDestroy} from "@angular/core";
import { RenderService, CarInfos } from "../render-service/render.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";
import { SoundManagerService } from "../sound-manager-service/sound-manager.service";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        CameraManagerService,
        SoundManagerService
            ]
})

export class GameComponent implements AfterViewInit, OnDestroy {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService, private soundManager: SoundManagerService) { }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public get carInfos(): CarInfos {
        return this.renderService.carInfos;
    }
    public ngOnDestroy(): void {

        this.soundManager.stopAllSounds();
    }
}
