import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSendToReviewComponent } from './dialog-confirm-send-to-review.component';

describe('DialogConfirmSendToReviewComponent', () => {
  let component: DialogConfirmSendToReviewComponent;
  let fixture: ComponentFixture<DialogConfirmSendToReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmSendToReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogConfirmSendToReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
