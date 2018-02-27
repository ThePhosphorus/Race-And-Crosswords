import { Component } from "@angular/core";
import { Track } from "../../../../../../common/communication/track";
import { TrackLoaderService } from "../../track-loader/track-loader.service";

@Component({
    selector: "app-track-list",
    templateUrl: "./track-list.component.html",
    styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent {
    public tracks: Array<Track>;

    public constructor(private trackloader: TrackLoaderService) {
        this.tracks = new Array<Track>();

        this.trackloader.loadAll().subscribe((tracks: Track[]) => this.tracks = tracks);
    }
}
