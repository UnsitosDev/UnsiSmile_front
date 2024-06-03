import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationOralComponent } from './exploration-oral.component';

describe('ExplorationOralComponent', () => {
  let component: ExplorationOralComponent;
  let fixture: ComponentFixture<ExplorationOralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorationOralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorationOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
