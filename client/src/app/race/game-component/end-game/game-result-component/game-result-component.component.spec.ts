import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameResultComponentComponent } from "./game-result-component.component";
import { EndGameService } from "../end-game-service/end-game.service";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { LoaderService } from "../../loader-service/loader.service";

describe("GameResultComponentComponent", () => {
    let component: GameResultComponentComponent;
    let fixture: ComponentFixture<GameResultComponentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameResultComponentComponent],
            providers: [EndGameService, TrackLoaderService, HttpClient, HttpHandler, LoaderService]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameResultComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
