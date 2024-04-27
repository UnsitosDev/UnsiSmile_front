import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryIdComponent } from './history-id.component';

describe('HistoryIdComponent', () => {
  let component: HistoryIdComponent;
  let fixture: ComponentFixture<HistoryIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
