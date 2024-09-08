import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFunctionalAnalisisComponent } from './form-functional-analisis.component';

describe('FormFunctionalAnalisisComponent', () => {
  let component: FormFunctionalAnalisisComponent;
  let fixture: ComponentFixture<FormFunctionalAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFunctionalAnalisisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFunctionalAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
