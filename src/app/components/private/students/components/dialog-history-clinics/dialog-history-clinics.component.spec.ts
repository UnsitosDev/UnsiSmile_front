import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoryClinicsComponent } from './dialog-history-clinics.component';

describe('DialogHistoryClinicsComponent', () => {
  let component: DialogHistoryClinicsComponent;
  let fixture: ComponentFixture<DialogHistoryClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHistoryClinicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogHistoryClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
