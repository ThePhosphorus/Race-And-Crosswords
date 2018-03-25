import { Component } from "@angular/core";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { Track } from "../../../../../common/communication/track";

@Component({
    selector: "app-game-menu",
    templateUrl: "./game-menu.component.html",
    styleUrls: ["./game-menu.component.css"],
    providers: [TrackLoaderService]
})
export class GameMenuComponent {

    private tracks: Array<Track>;
    public openedTrack: Track;
    public hasDetailsOpen: boolean;

    public constructor(private _trackLoader: TrackLoaderService) {
        this.tracks = new Array<Track>();
        this._trackLoader.loadAll().subscribe((ts: Track[]) => this.tracks = ts);
        this.hasDetailsOpen = false;
    }

    public open(track: Track): void {
        this.openedTrack = track;
        this.hasDetailsOpen = true;
    }

    public close(): void {
        this.openedTrack = null;
        this.hasDetailsOpen = false;
    }

}
