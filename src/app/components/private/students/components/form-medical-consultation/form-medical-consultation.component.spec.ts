import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMedicalConsultationComponent } from './form-medical-consultation.component';

describe('FormMedicalConsultationComponent', () => {
  let component: FormMedicalConsultationComponent;
  let fixture: ComponentFixture<FormMedicalConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMedicalConsultationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormMedicalConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
