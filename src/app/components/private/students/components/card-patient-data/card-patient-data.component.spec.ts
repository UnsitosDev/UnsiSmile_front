import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPatientDataComponent } from './card-patient-data.component';

describe('CardPatientDataComponent', () => {
  let component: CardPatientDataComponent;
  let fixture: ComponentFixture<CardPatientDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPatientDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPatientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
