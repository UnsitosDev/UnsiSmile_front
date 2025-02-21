import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveDentistryPublicHealthComponent } from './preventive-dentistry-public-health.component';

describe('PreventiveDentistryPublicHealthComponent', () => {
  let component: PreventiveDentistryPublicHealthComponent;
  let fixture: ComponentFixture<PreventiveDentistryPublicHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiveDentistryPublicHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreventiveDentistryPublicHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
