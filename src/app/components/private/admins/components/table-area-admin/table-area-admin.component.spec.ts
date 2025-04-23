import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAreaAdminComponent } from './table-area-admin.component';

describe('TableAreaAdminComponent', () => {
  let component: TableAreaAdminComponent;
  let fixture: ComponentFixture<TableAreaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAreaAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableAreaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
