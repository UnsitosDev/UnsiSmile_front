import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdminStatsComponentComponent } from './dashboard-admin-stats-component.component';

describe('DashboardAdminStatsComponentComponent', () => {
  let component: DashboardAdminStatsComponentComponent;
  let fixture: ComponentFixture<DashboardAdminStatsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdminStatsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardAdminStatsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
