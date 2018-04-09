import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionTileComponent } from './definition-tile.component';

describe('DefinitionTileComponent', () => {
  let component: DefinitionTileComponent;
  let fixture: ComponentFixture<DefinitionTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinitionTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
