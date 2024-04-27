import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsPeriodonticsHistoryComponent } from './students-periodontics-history.component';

describe('StudentsPeriodonticsHistoryComponent', () => {
  let component: StudentsPeriodonticsHistoryComponent;
  let fixture: ComponentFixture<StudentsPeriodonticsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsPeriodonticsHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsPeriodonticsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
