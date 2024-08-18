import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterrogationDivicesSystemsComponent } from './interrogation-divices-systems.component';

describe('InterrogationDivicesSystemsComponent', () => {
  let component: InterrogationDivicesSystemsComponent;
  let fixture: ComponentFixture<InterrogationDivicesSystemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterrogationDivicesSystemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InterrogationDivicesSystemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
