import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreAdderComponent } from './highscore-adder.component';

describe('HighscoreAdderComponent', () => {
  let component: HighscoreAdderComponent;
  let fixture: ComponentFixture<HighscoreAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoreAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscoreAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
