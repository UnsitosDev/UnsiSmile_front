import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsGeneralHistoryComponent } from './students-general-history.component';

describe('StudentsGeneralHistoryComponent', () => {
  let component: StudentsGeneralHistoryComponent;
  let fixture: ComponentFixture<StudentsGeneralHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsGeneralHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsGeneralHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
