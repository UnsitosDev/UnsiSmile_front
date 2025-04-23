import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHistoryClinicComponent } from './header-history-clinic.component';

describe('HeaderHistoryClinicComponent', () => {
  let component: HeaderHistoryClinicComponent;
  let fixture: ComponentFixture<HeaderHistoryClinicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderHistoryClinicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderHistoryClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
