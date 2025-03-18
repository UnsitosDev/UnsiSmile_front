import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUpdateStudentComponent } from './form-update-student.component';

describe('FormUpdateStudentComponent', () => {
  let component: FormUpdateStudentComponent;
  let fixture: ComponentFixture<FormUpdateStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUpdateStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormUpdateStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
