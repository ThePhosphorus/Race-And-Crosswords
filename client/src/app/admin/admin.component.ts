import { Component } from "@angular/core";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { TrackSaverService } from "../track-saver/track-saver.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  providers: [TrackLoaderService, TrackSaverService]
})
export class AdminComponent {

  public constructor() { }

}
