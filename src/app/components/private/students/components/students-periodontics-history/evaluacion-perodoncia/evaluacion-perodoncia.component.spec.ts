import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionPerodonciaComponent } from './evaluacion-perodoncia.component';

describe('EvaluacionPerodonciaComponent', () => {
  let component: EvaluacionPerodonciaComponent;
  let fixture: ComponentFixture<EvaluacionPerodonciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionPerodonciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluacionPerodonciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
