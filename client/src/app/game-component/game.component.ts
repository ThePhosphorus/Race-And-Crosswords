import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService, CarInfos } from "../render-service/render.service";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { CameraManagerService } from "../camera-manager-service/camera-manager.service";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        CameraManagerService
    ]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService) { }

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
}
