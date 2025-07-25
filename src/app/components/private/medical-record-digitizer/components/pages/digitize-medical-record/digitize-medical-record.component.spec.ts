import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitizeMedicalRecordComponent } from './digitize-medical-record.component';

describe('DigitizeMedicalRecordComponent', () => {
  let component: DigitizeMedicalRecordComponent;
  let fixture: ComponentFixture<DigitizeMedicalRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitizeMedicalRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DigitizeMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
