import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPerodontalExamComponent } from './history-perodontal-exam.component';

describe('HistoryPerodontalExamComponent', () => {
  let component: HistoryPerodontalExamComponent;
  let fixture: ComponentFixture<HistoryPerodontalExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPerodontalExamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPerodontalExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
