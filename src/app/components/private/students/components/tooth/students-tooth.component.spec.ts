import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsToothComponent } from './students-tooth.component';

describe('StudentsToothComponent', () => {
  let component: StudentsToothComponent;
  let fixture: ComponentFixture<StudentsToothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsToothComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsToothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
