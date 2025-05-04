import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordGeneralTreatmentsComponent } from './medical-record-general-treatments.component';

describe('MedicalRecordGeneralTreatmentsComponent', () => {
  let component: MedicalRecordGeneralTreatmentsComponent;
  let fixture: ComponentFixture<MedicalRecordGeneralTreatmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordGeneralTreatmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalRecordGeneralTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
