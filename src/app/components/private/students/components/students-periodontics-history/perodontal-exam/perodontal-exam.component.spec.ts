import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerodontalExamComponent } from './perodontal-exam.component';

describe('PerodontalExamComponent', () => {
  let component: PerodontalExamComponent;
  let fixture: ComponentFixture<PerodontalExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerodontalExamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerodontalExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
