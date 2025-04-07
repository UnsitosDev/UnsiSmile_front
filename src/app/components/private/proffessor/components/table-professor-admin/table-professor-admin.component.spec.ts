import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProfessorAdminComponent } from './table-professor-admin.component';

describe('TableProfessorAdminComponent', () => {
  let component: TableProfessorAdminComponent;
  let fixture: ComponentFixture<TableProfessorAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProfessorAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableProfessorAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
