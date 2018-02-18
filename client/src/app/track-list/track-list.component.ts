import { Component } from "@angular/core";
import { Track } from "./track";

const FAKE_TRACKS_NUMBER: number = 4;

@Component({
    selector: "app-track-list",
    templateUrl: "./track-list.component.html",
    styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent {
    public tracks: Array<Track>;

    public constructor() {
        this.tracks = new Array<Track>();

        for (let i: number = 0; i < FAKE_TRACKS_NUMBER; i++) {
            this.tracks.push(new Track(i, "Test track that is super important"));
        }
    }

}
