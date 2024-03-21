import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFacialExamComponent } from './history-facial-exam.component';

describe('HistoryFacialExamComponent', () => {
  let component: HistoryFacialExamComponent;
  let fixture: ComponentFixture<HistoryFacialExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryFacialExamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryFacialExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
