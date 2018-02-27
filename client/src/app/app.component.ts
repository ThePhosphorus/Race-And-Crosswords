import { Component, OnInit, HostListener } from "@angular/core";
import { InputManagerService } from "./race/input-manager-service/input-manager.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    public constructor(public inputManager: InputManagerService) { }

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
}
