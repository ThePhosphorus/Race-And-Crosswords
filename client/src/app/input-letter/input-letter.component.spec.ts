import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLetterComponent } from './input-letter.component';

describe('InputLetterComponent', () => {
    let component: InputLetterComponent;
    let fixture: ComponentFixture<InputLetterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputLetterComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputLetterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
