import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSingsPeriodonticsComponent } from './vital-sings-periodontics.component';

describe('VitalSingsComponent', () => {
  let component: VitalSingsPeriodonticsComponent;
  let fixture: ComponentFixture<VitalSingsPeriodonticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSingsPeriodonticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VitalSingsPeriodonticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
