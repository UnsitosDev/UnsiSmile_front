import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryVitalSingsComponent } from './history-vital-sings.component';

describe('HistoryVitalSingsComponent', () => {
  let component: HistoryVitalSingsComponent;
  let fixture: ComponentFixture<HistoryVitalSingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryVitalSingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryVitalSingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
