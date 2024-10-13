import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLaboratoryStudyAndBiopsyComponent } from './form-laboratory-study-and-biopsy.component';

describe('FormLaboratoryStudyAndBiopsyComponent', () => {
  let component: FormLaboratoryStudyAndBiopsyComponent;
  let fixture: ComponentFixture<FormLaboratoryStudyAndBiopsyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLaboratoryStudyAndBiopsyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormLaboratoryStudyAndBiopsyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
