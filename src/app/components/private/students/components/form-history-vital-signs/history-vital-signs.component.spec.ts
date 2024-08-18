import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryVitalSignsComponent } from './history-vital-signs.component';

describe('HistoryVitalSignsComponent', () => {
  let component: HistoryVitalSignsComponent;
  let fixture: ComponentFixture<HistoryVitalSignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryVitalSignsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryVitalSignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
