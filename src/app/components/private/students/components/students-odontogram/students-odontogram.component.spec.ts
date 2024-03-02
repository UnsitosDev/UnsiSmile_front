import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsOdontogramComponent } from './students-odontogram.component';

describe('StudentsOdontogramComponent', () => {
  let component: StudentsOdontogramComponent;
  let fixture: ComponentFixture<StudentsOdontogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsOdontogramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsOdontogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
