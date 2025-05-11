import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRateTreatmentComponent } from './dialog-rate-treatment.component';

describe('DialogRateTreatmentComponent', () => {
  let component: DialogRateTreatmentComponent;
  let fixture: ComponentFixture<DialogRateTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRateTreatmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRateTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
