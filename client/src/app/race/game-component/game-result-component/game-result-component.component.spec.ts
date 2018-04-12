import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResultComponentComponent } from './game-result-component.component';

describe('GameResultComponentComponent', () => {
  let component: GameResultComponentComponent;
  let fixture: ComponentFixture<GameResultComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResultComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
