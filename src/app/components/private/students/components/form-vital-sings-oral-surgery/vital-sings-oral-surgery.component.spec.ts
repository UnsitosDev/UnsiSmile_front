import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSingsOralSurgeryComponent } from './vital-sings-oral-surgery.component';

describe('VitalSingsComponent', () => {
  let component: VitalSingsOralSurgeryComponent;
  let fixture: ComponentFixture<VitalSingsOralSurgeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSingsOralSurgeryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VitalSingsOralSurgeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
