import { Component, OnInit, HostListener } from "@angular/core";
import { InputManagerService } from "./input-manager-service/input-manager.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    public constructor(private inputManager: InputManagerService) { }

    public title: string;

    public ngOnInit(): void {
        this.title = "LOG2990";
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.inputManager.handleKeyUp(event);
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputManager.handleKeyDown(event);
    }

    @HostListener("window.mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.inputManager.handleMouseDown(event);
    }

    @HostListener("window.mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.inputManager.handleMouseUp(event);
    }

    @HostListener("window.mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.inputManager.handleMouseMove(event);
    }
}
