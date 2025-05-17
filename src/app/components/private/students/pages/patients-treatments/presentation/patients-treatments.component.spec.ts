import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsTreatmentsComponent } from './patients-treatments.component';

describe('PatientsTreatmentsComponent', () => {
  let component: PatientsTreatmentsComponent;
  let fixture: ComponentFixture<PatientsTreatmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientsTreatmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientsTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
