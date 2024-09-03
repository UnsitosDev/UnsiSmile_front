import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterrogationPeriodonticsComponent } from './interrogation-periodontics.component';

describe('InterrogationComponent', () => {
  let component: InterrogationPeriodonticsComponent;
  let fixture: ComponentFixture<InterrogationPeriodonticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterrogationPeriodonticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterrogationPeriodonticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
