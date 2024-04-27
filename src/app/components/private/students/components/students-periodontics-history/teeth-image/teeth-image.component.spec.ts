import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeethImageComponent } from './teeth-image.component';

describe('TeethImageComponent', () => {
  let component: TeethImageComponent;
  let fixture: ComponentFixture<TeethImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeethImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeethImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
