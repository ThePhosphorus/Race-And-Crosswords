import { Component, OnInit } from "@angular/core";

const NUMBER_OF_LIGHTS: number = 3;

@Component({
    selector: "app-start-display",
    templateUrl: "./start-display.component.html",
    styleUrls: ["./start-display.component.css"]
})
export class StartDisplayComponent implements OnInit {

    public lights: Array<boolean>;

    public constructor() {
        this.lights = new Array<boolean>();
        for (let i: number = 0; i < NUMBER_OF_LIGHTS; i++) {
            this.lights.push(true);
        }
    }

    public ngOnInit(): void { }

}
