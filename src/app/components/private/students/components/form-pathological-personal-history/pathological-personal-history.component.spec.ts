import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologicalPersonalHistoryComponent } from './pathological-personal-history.component';

describe('PathologicalPersonalHistoryComponent', () => {
  let component: PathologicalPersonalHistoryComponent;
  let fixture: ComponentFixture<PathologicalPersonalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathologicalPersonalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PathologicalPersonalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
