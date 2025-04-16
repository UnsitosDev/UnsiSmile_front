import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClinicalAreaComponent } from './form-clinical-area.component';

describe('FormClinicalAreaComponent', () => {
  let component: FormClinicalAreaComponent;
  let fixture: ComponentFixture<FormClinicalAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormClinicalAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormClinicalAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
