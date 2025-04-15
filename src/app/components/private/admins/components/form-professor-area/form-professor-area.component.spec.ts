import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProfessorAreaComponent } from './form-professor-area.component';

describe('FormProfessorAreaComponent', () => {
  let component: FormProfessorAreaComponent;
  let fixture: ComponentFixture<FormProfessorAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProfessorAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormProfessorAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
