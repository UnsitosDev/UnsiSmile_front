import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilaxisComponent } from './profilaxis.component';

describe('ProfilaxisComponent', () => {
  let component: ProfilaxisComponent;
  let fixture: ComponentFixture<ProfilaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilaxisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
