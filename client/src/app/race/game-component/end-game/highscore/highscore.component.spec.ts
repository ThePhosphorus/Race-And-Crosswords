import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HighscoreComponent } from "./highscore.component";
import { EndGameService } from "../end-game-service/end-game.service";
import { LoaderService } from "../../loader-service/loader.service";
import { HttpHandler, HttpClient } from "@angular/common/http";
import { TrackLoaderService } from "../../../track-loader/track-loader.service";

describe("HighscoreComponent", () => {
    let component: HighscoreComponent;
    let fixture: ComponentFixture<HighscoreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HighscoreComponent],
            providers: [
                EndGameService,
                TrackLoaderService,
                HttpClient,
                HttpHandler,
                LoaderService,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HighscoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
