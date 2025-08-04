import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReportsTreatmentsComponent } from './dialog-reports-treatments.component';

describe('DialogReportsTreatmentsComponent', () => {
  let component: DialogReportsTreatmentsComponent;
  let fixture: ComponentFixture<DialogReportsTreatmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogReportsTreatmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogReportsTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
