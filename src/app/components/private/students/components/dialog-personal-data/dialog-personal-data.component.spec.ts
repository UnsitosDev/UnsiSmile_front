import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPersonalDataComponent } from './dialog-personal-data.component';

describe('DialogPersonalDataComponent', () => {
  let component: DialogPersonalDataComponent;
  let fixture: ComponentFixture<DialogPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPersonalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
