import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentConditionComponent } from './current-condition.component';

describe('CurrentConditionComponent', () => {
  let component: CurrentConditionComponent;
  let fixture: ComponentFixture<CurrentConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentConditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
