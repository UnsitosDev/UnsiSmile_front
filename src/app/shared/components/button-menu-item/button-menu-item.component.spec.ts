import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonMenuItemComponent } from './button-menu-item.component';

describe('ButtonMenuItemComponent', () => {
  let component: ButtonMenuItemComponent;
  let fixture: ComponentFixture<ButtonMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonMenuItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
