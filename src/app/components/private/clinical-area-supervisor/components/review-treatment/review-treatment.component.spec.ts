import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTreatmentComponent } from './review-treatment.component';

describe('ReviewTreatmentComponent', () => {
  let component: ReviewTreatmentComponent;
  let fixture: ComponentFixture<ReviewTreatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTreatmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
