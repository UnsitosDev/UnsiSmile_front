import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewHistoryClinicsComponent } from './review-history-clinics.component';

describe('ReviewHistoryClinicsComponent', () => {
  let component: ReviewHistoryClinicsComponent;
  let fixture: ComponentFixture<ReviewHistoryClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewHistoryClinicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewHistoryClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
