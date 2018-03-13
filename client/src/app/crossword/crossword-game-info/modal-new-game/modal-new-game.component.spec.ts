import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewGameComponent } from './modal-new-game.component';

describe('ModalNewGameComponent', () => {
  let component: ModalNewGameComponent;
  let fixture: ComponentFixture<ModalNewGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
