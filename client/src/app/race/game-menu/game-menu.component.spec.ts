import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameMenuComponent } from "./game-menu.component";
import { TrackLoaderService } from "../track-loader/track-loader.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Track } from "../../../../../common/race/track";
import { Vector3Struct } from "../../../../../common/race/vector3-struct";

describe("GameMenuComponent", () => {
    let component: GameMenuComponent;
    let fixture: ComponentFixture<GameMenuComponent>;
    const points: Array<Vector3Struct> = [new Vector3Struct(0, 0, 0),
                                          new Vector3Struct(1, 0, 0),
                                          new Vector3Struct(1, 0, 1),
                                          new Vector3Struct(0, 0, 1),
                                          new Vector3Struct(0, 0, 0)];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameMenuComponent],
            providers: [TrackLoaderService, HttpClient],
            imports: [HttpClientModule, RouterTestingModule]
        })
            .compileComponents().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should open track", () => {
        const tempTrack: Track = new Track("id", "name", "description", points, 0);
        component.open(tempTrack);
        expect(component.hasDetailsOpen).toBeTruthy();
        expect(component.openedTrack).toBe(tempTrack);
    });

    it("should close track", () => {
        const tempTrack: Track = new Track("id", "name", "description", points, 0);
        component.open(tempTrack);
        expect(component.hasDetailsOpen).toBeTruthy();
        component.close();
        expect(component.hasDetailsOpen).toBeFalsy();
        expect(component.openedTrack).toBe(null);
    });
});
