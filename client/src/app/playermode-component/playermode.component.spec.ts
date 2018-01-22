import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayermodeComponent } from './playermode.component';

describe('PlayermodeComponent', () => {
  let component: PlayermodeComponent;
  let fixture: ComponentFixture<PlayermodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayermodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayermodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
