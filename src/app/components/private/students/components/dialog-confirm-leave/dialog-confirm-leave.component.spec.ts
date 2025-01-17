import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmLeaveComponent } from './dialog-confirm-leave.component';

describe('DialogConfirmLeaveComponent', () => {
  let component: DialogConfirmLeaveComponent;
  let fixture: ComponentFixture<DialogConfirmLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirmLeaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogConfirmLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
