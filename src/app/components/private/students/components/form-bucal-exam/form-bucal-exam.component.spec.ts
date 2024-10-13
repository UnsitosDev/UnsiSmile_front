import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBucalExamComponent } from './form-bucal-exam.component';

describe('FormBucalExamComponent', () => {
  let component: FormBucalExamComponent;
  let fixture: ComponentFixture<FormBucalExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBucalExamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBucalExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
