import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    public constructor() { }

    public readonly title: string = "LOG2990";
    public message: string;

    public ngOnInit(): void {
    }
}
