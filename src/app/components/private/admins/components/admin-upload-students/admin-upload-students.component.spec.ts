import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUploadStudentsComponent } from './admin-upload-students.component';

describe('AdminUploadStudentsComponent', () => {
  let component: AdminUploadStudentsComponent;
  let fixture: ComponentFixture<AdminUploadStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUploadStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUploadStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
