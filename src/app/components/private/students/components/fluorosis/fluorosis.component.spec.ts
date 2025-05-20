import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluorosisComponent } from './fluorosis.component';

describe('FluorosisComponent', () => {
  let component: FluorosisComponent;
  let fixture: ComponentFixture<FluorosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluorosisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FluorosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
