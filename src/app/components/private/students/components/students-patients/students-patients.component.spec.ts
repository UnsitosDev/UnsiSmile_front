import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPatientsComponent } from './students-patients.component';

describe('StudentsPatientsComponent', () => {
  let component: StudentsPatientsComponent;
  let fixture: ComponentFixture<StudentsPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
