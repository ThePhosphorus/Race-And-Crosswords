import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StartDisplayComponent } from "./start-display.component";

describe("StartDisplayComponent", () => {
    let component: StartDisplayComponent;
    let fixture: ComponentFixture<StartDisplayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StartDisplayComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartDisplayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
