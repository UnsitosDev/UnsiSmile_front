import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsOralSurgeryHistoryComponent } from './students-oral-surgery-history.component';

describe('StudentsOralSurgeryHistoryComponent', () => {
  let component: StudentsOralSurgeryHistoryComponent;
  let fixture: ComponentFixture<StudentsOralSurgeryHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsOralSurgeryHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsOralSurgeryHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
