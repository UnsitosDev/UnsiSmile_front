import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryInterrogationDivicesSystemsComponent } from './history-interrogation-divices-systems.component';

describe('HistoryInterrogationDivicesSystemsComponent', () => {
  let component: HistoryInterrogationDivicesSystemsComponent;
  let fixture: ComponentFixture<HistoryInterrogationDivicesSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryInterrogationDivicesSystemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryInterrogationDivicesSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
