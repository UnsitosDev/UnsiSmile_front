import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryExplorationOralComponent } from './history-exploration-oral.component';

describe('HistoryExplorationOralComponent', () => {
  let component: HistoryExplorationOralComponent;
  let fixture: ComponentFixture<HistoryExplorationOralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryExplorationOralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryExplorationOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
