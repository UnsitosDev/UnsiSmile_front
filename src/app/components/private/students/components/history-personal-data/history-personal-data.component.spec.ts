import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPersonalDataComponent } from './history-personal-data.component';

describe('HistoryPersonalDataComponent', () => {
  let component: HistoryPersonalDataComponent;
  let fixture: ComponentFixture<HistoryPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPersonalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
