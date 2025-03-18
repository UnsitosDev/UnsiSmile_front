import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStudentStatsComponentComponent } from './dashboard-student-stats-component.component';

describe('DashboardStudentStatsComponentComponent', () => {
  let component: DashboardStudentStatsComponentComponent;
  let fixture: ComponentFixture<DashboardStudentStatsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStudentStatsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardStudentStatsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
