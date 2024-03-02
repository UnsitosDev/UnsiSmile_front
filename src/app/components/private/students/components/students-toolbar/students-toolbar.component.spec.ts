import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsToolbarComponent } from './students-toolbar.component';

describe('StudentsToolbarComponent', () => {
  let component: StudentsToolbarComponent;
  let fixture: ComponentFixture<StudentsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
