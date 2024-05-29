import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryIdentificationFileComponent } from './history-identification-file.component';

describe('HistoryIdentificationFileComponent', () => {
  let component: HistoryIdentificationFileComponent;
  let fixture: ComponentFixture<HistoryIdentificationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryIdentificationFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryIdentificationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
