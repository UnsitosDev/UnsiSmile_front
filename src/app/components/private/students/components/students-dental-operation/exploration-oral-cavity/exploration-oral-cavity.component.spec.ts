import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorationOralCavityComponent } from './exploration-oral-cavity.component';

describe('ExplorationOralCavityComponent', () => {
  let component: ExplorationOralCavityComponent;
  let fixture: ComponentFixture<ExplorationOralCavityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorationOralCavityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExplorationOralCavityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
