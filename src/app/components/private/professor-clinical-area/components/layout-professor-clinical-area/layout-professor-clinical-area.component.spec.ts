import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutProfessorClinicalAreaComponent } from './layout-professor-clinical-area.component';

describe('LayoutProfessorClinicalAreaComponent', () => {
  let component: LayoutProfessorClinicalAreaComponent;
  let fixture: ComponentFixture<LayoutProfessorClinicalAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutProfessorClinicalAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayoutProfessorClinicalAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
