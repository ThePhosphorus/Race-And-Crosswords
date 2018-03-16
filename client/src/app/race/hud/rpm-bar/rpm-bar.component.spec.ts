import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RpmBarComponent } from "./rpm-bar.component";

describe("RpmBarComponent", () => {
  let component: RpmBarComponent;
  let fixture: ComponentFixture<RpmBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpmBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpmBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
