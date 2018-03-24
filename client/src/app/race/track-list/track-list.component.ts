import { Component } from "@angular/core";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track } from "../../../../../common/communication/track";

@Component({
    selector: "app-track-list",
    templateUrl: "./track-list.component.html",
    styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent {

    private tracks: Array<Track>;

    public constructor(private _trackLoader: TrackLoaderService) {
        this.tracks = new Array<Track>();
        this._trackLoader.loadAll().subscribe((ts: Track[]) => this.tracks = ts);
    }

}
