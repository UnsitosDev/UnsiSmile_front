import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPathologicalPersonalHistoryComponent } from './no-pathological-personal-history.component';

describe('NoPathologicalPersonalHistoryComponent', () => {
  let component: NoPathologicalPersonalHistoryComponent;
  let fixture: ComponentFixture<NoPathologicalPersonalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPathologicalPersonalHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoPathologicalPersonalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
