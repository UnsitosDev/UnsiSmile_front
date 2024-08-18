import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionPerodonciaComponent } from './periodontic-evaluation.component';

describe('PeriodonticEvaluationComponent', () => {
  let component: EvaluacionPerodonciaComponent;
  let fixture: ComponentFixture<EvaluacionPerodonciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionPerodonciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluacionPerodonciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
