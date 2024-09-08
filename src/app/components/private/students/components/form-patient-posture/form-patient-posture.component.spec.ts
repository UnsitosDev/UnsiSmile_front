import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPatientPostureComponent } from './form-patient-posture.component';

describe('FormPatientPostureComponent', () => {
  let component: FormPatientPostureComponent;
  let fixture: ComponentFixture<FormPatientPostureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPatientPostureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPatientPostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
