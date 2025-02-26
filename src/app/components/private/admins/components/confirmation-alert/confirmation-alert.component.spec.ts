import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationAlertComponent } from './confirmation-alert.component';

describe('ConfirmationAlertComponent', () => {
  let component: ConfirmationAlertComponent;
  let fixture: ComponentFixture<ConfirmationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
