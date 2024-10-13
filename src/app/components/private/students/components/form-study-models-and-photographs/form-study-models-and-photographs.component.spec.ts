import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStudyModelsAndPhotographsComponent } from './form-study-models-and-photographs.component';

describe('FormStudyModelsAndPhotographsComponent', () => {
  let component: FormStudyModelsAndPhotographsComponent;
  let fixture: ComponentFixture<FormStudyModelsAndPhotographsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStudyModelsAndPhotographsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormStudyModelsAndPhotographsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
