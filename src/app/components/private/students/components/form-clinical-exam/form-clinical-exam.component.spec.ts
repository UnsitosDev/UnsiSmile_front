import { ComponentFixture, TestBed } from '@angular/core/testing';

import { clinicalExamComponent } from './form-clinical-exam.component';

describe('HistoryMultidiciplinaryEvaluationComponent', () => {
  let component: clinicalExamComponent;
  let fixture: ComponentFixture<clinicalExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [clinicalExamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(clinicalExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
