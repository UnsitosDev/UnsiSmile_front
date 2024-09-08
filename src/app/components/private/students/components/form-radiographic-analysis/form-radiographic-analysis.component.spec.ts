import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadiographicAnalysisComponent } from './form-radiographic-analysis.component';

describe('FormRadiographicAnalysisComponent', () => {
  let component: FormRadiographicAnalysisComponent;
  let fixture: ComponentFixture<FormRadiographicAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRadiographicAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormRadiographicAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
