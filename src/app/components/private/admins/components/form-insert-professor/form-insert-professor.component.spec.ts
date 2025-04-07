import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInsertProfessorComponent } from './form-insert-professor.component';

describe('FormInsertProfessorComponent', () => {
  let component: FormInsertProfessorComponent;
  let fixture: ComponentFixture<FormInsertProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInsertProfessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormInsertProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
