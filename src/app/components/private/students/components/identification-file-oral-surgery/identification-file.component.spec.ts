import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationFileComponent } from './identification-file.component';

describe('IdentificationFileComponent', () => {
  let component: IdentificationFileComponent;
  let fixture: ComponentFixture<IdentificationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentificationFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdentificationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
