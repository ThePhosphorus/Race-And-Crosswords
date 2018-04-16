import { TestBed, inject } from "@angular/core/testing";

import { EndGameService } from "./end-game.service";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { LoaderService } from "../../loader-service/loader.service";
import { UserPlayer } from "../../player/user-player";
import { InputManagerService } from "../../../input-manager-service/input-manager.service";
import { Track } from "../../../../../../../common/race/track";
import { Highscore } from "../../../../../../../common/race/highscore";
import { AiPlayer } from "../../player/ai-player";

// tslint:disable:no-magic-numbers
describe("EndGameService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EndGameService, TrackLoaderService, HttpClient, HttpHandler, LoaderService, InputManagerService]
        });
    });

    it("should be created", inject([EndGameService], (service: EndGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should display end game", inject([EndGameService], (service: EndGameService) => {
        service.handleEndGame(null, null, null);
        expect(service.displayResult).toBeTruthy();
    }));

    it("should allow user to add score when in top 5", inject([EndGameService], (service: EndGameService) => {
        const player: UserPlayer = new UserPlayer(TestBed.get(InputManagerService));
        player.lapTimes.push(10);
        player.lapTimes.push(10);
        player.lapTimes.push(10);

        const hs: Array<Highscore> = new Array<Highscore>();
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));

        const track: Track = new Track("id", "name", "description", null, 0, hs);

        service.handleEndGame(player, new Array<AiPlayer>(), track);
        service.closeResult();
        expect(service.displayHighscoreAdder).toBeTruthy();
    }));

    it("should prevent user to add score when not in top 5", inject([EndGameService], (service: EndGameService) => {
        const player: UserPlayer = new UserPlayer(TestBed.get(InputManagerService));
        player.lapTimes.push(1000);
        player.lapTimes.push(1000);

        const hs: Array<Highscore> = new Array<Highscore>();
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));
        hs.push(new Highscore("Name", 300));

        const track: Track = new Track("id", "name", "description", null, 0, hs);

        service.handleEndGame(player, new Array<AiPlayer>(), track);
        service.closeResult();
        expect(service.displayHighscoreAdder).toBeFalsy();
    }));
});
