import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    public constructor() { }

    public title: string ;

    public ngOnInit(): void {
        this.title = "LOG2990";
    }
}
