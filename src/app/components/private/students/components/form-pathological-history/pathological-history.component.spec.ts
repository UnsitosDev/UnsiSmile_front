import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologicalHistoryComponent } from './pathological-history.component';

describe('PathologicalHistoryComponent', () => {
  let component: PathologicalHistoryComponent;
  let fixture: ComponentFixture<PathologicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathologicalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PathologicalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
