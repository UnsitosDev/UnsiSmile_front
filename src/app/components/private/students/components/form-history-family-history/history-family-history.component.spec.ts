import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFamilyHistoryComponent } from './history-family-history.component';

describe('HistoryFamilyHistoryComponent', () => {
  let component: HistoryFamilyHistoryComponent;
  let fixture: ComponentFixture<HistoryFamilyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryFamilyHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryFamilyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
