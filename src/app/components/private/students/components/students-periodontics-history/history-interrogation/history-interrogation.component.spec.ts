import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryInterrogationComponent } from './history-interrogation.component';

describe('HistoryInterrogationComponent', () => {
  let component: HistoryInterrogationComponent;
  let fixture: ComponentFixture<HistoryInterrogationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryInterrogationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryInterrogationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
