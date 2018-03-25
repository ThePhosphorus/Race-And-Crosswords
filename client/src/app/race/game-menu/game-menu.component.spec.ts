import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameMenuComponent } from "./game-menu.component";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";

describe("GameMenuComponent", () => {
    let component: GameMenuComponent;
    let fixture: ComponentFixture<GameMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameMenuComponent],
            providers: [TrackLoaderService, HttpClient],
            imports: [RouterModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
