import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTreatmentPlanComponent } from './history-treatment-plan.component';

describe('HistoryTreatmentPlanComponent', () => {
  let component: HistoryTreatmentPlanComponent;
  let fixture: ComponentFixture<HistoryTreatmentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryTreatmentPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryTreatmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
