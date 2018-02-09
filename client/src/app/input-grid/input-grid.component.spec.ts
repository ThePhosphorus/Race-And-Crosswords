import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputGridComponent } from './input-grid.component';

describe('InputGridComponent', () => {
  let component: InputGridComponent;
  let fixture: ComponentFixture<InputGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
