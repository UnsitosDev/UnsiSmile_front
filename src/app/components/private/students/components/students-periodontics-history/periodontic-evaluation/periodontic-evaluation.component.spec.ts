import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodonticEvaluationComponent } from './periodontic-evaluation.component';

describe('PeriodonticEvaluationComponent', () => {
  let component: PeriodonticEvaluationComponent;
  let fixture: ComponentFixture<PeriodonticEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodonticEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodonticEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
