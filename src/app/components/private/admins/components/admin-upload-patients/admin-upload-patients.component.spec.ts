import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadPatientsComponent } from './admin-upload-patients.component';

describe('AdminUploadPatientsComponent', () => {
  let component: AdminUploadPatientsComponent;
  let fixture: ComponentFixture<AdminUploadPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUploadPatientsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUploadPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
