import { TestBed, inject } from "@angular/core/testing";

import { EndGameService } from "./end-game.service";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { LoaderService } from "../../loader-service/loader.service";

describe("EndGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EndGameService, TrackLoaderService, HttpClient, HttpHandler, LoaderService]
        });
    });

    it("should be created", inject([EndGameService], (service: EndGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should display end game", inject([EndGameService], (service: EndGameService) => {
        service.handleEndGame(null, null, null);
        expect(service.displayResult).toBeTruthy();
    }));
});
