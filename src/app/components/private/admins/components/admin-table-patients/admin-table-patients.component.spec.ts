import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTablePatientsComponent } from './admin-table-patients.component';

describe('AdminTablePatientsComponent', () => {
  let component: AdminTablePatientsComponent;
  let fixture: ComponentFixture<AdminTablePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTablePatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTablePatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
