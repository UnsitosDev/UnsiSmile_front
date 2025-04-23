import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProfessorClinicalComponent } from './table-professor-clinical.component';

describe('TableProfessorClinicalComponent', () => {
  let component: TableProfessorClinicalComponent;
  let fixture: ComponentFixture<TableProfessorClinicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProfessorClinicalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableProfessorClinicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
