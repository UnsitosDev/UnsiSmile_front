import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsDentalOperationComponent } from './students-dental-operation.component';

describe('StudentsDentalOperationComponent', () => {
  let component: StudentsDentalOperationComponent;
  let fixture: ComponentFixture<StudentsDentalOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsDentalOperationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsDentalOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
