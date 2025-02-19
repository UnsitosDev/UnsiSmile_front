import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatsStudentComponent } from './dashboard-stats-student.component';

describe('DashboardStatsStudentComponent', () => {
  let component: DashboardStatsStudentComponent;
  let fixture: ComponentFixture<DashboardStatsStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatsStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardStatsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
