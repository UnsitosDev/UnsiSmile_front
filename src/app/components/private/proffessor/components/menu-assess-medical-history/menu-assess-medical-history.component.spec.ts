import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAssessMedicalHistoryComponent } from './menu-assess-medical-history.component';

describe('MenuAssessMedicalHistoryComponent', () => {
  let component: MenuAssessMedicalHistoryComponent;
  let fixture: ComponentFixture<MenuAssessMedicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuAssessMedicalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuAssessMedicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
