import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalSingsComponent } from './vital-sings.component';

describe('VitalSingsComponent', () => {
  let component: VitalSingsComponent;
  let fixture: ComponentFixture<VitalSingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitalSingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VitalSingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
