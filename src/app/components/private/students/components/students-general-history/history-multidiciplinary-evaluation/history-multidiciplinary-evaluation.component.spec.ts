import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryMultidiciplinaryEvaluationComponent } from './history-multidiciplinary-evaluation.component';

describe('HistoryMultidiciplinaryEvaluationComponent', () => {
  let component: HistoryMultidiciplinaryEvaluationComponent;
  let fixture: ComponentFixture<HistoryMultidiciplinaryEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryMultidiciplinaryEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryMultidiciplinaryEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
