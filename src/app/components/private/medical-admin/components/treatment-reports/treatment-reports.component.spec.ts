import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentReportsComponent } from './treatment-reports.component';

describe('TreatmentReportsComponent', () => {
  let component: TreatmentReportsComponent;
  let fixture: ComponentFixture<TreatmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreatmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
