import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCurrentConditionComponent } from './history-current-condition.component';

describe('HistoryCurrentConditionComponent', () => {
  let component: HistoryCurrentConditionComponent;
  let fixture: ComponentFixture<HistoryCurrentConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryCurrentConditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryCurrentConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
