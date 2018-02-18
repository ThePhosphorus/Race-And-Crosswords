import { Component, OnInit } from "@angular/core";
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

    public onKeyUp(event: KeyboardEvent): void {
        this.inputManager.handleKeyUp(event);
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.inputManager.handleKeyDown(event);
    }
}
