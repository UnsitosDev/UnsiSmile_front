import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilesSectionComponent } from './admin-files-section.component';

describe('AdminFilesSectionComponent', () => {
  let component: AdminFilesSectionComponent;
  let fixture: ComponentFixture<AdminFilesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFilesSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminFilesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
