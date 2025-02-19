import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AditionalCardsStudentComponent } from './aditional-cards-student.component';

describe('AditionalCardsStudentComponent', () => {
  let component: AditionalCardsStudentComponent;
  let fixture: ComponentFixture<AditionalCardsStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AditionalCardsStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AditionalCardsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
