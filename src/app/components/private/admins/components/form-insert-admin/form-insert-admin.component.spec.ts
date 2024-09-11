import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInsertAdminComponent } from './form-insert-admin.component';

describe('FormInsertAdminComponent', () => {
  let component: FormInsertAdminComponent;
  let fixture: ComponentFixture<FormInsertAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInsertAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInsertAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
