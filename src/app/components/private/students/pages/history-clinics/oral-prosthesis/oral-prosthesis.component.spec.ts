import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OralProsthesisComponent } from './oral-prosthesis.component';

describe('OralProsthesisComponent', () => {
  let component: OralProsthesisComponent;
  let fixture: ComponentFixture<OralProsthesisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OralProsthesisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OralProsthesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
