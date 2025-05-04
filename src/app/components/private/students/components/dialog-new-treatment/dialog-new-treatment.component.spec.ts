import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewTreatmentComponent } from './dialog-new-treatment.component';

describe('DialogNewTreatmentComponent', () => {
  let component: DialogNewTreatmentComponent;
  let fixture: ComponentFixture<DialogNewTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNewTreatmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogNewTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
