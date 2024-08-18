import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPatientDetailComponent } from './students-patient-detail.component';

describe('StudentsPatientDetailComponent', () => {
  let component: StudentsPatientDetailComponent;
  let fixture: ComponentFixture<StudentsPatientDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsPatientDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsPatientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
