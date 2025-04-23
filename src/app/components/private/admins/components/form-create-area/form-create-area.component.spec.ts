import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateAreaComponent } from './form-create-area.component';

describe('FormCreateAreaComponent', () => {
  let component: FormCreateAreaComponent;
  let fixture: ComponentFixture<FormCreateAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCreateAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
