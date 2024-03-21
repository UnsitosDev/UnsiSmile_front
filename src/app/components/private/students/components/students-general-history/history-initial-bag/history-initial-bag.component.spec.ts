import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryInitialBagComponent } from './history-initial-bag.component';

describe('HistoryInitialBagComponent', () => {
  let component: HistoryInitialBagComponent;
  let fixture: ComponentFixture<HistoryInitialBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryInitialBagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryInitialBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
