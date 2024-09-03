import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPatientPersonalDataComponent } from './form-patient-personal-data.component';

describe('FormPatientPersonalDataComponent', () => {
  let component: FormPatientPersonalDataComponent;
  let fixture: ComponentFixture<FormPatientPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPatientPersonalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPatientPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
