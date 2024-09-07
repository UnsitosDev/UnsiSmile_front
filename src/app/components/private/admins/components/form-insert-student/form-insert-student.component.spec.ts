import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInsertStudentComponent } from './form-insert-student.component';

describe('FormInsertStudentComponent', () => {
  let component: FormInsertStudentComponent;
  let fixture: ComponentFixture<FormInsertStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInsertStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInsertStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
