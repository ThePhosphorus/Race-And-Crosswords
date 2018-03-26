import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalEndGameComponent } from "./modal-end-game.component";

describe("ModalEndGameComponent", () => {
  let component: ModalEndGameComponent;
  let fixture: ComponentFixture<ModalEndGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEndGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEndGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should start game with same configuration", () => {
    expect(component).toBeTruthy();
  });

});
