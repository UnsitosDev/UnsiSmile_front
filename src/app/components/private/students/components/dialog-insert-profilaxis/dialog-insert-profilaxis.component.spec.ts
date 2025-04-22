import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInsertProfilaxisComponent } from './dialog-insert-profilaxis.component';

describe('DialogInsertProfilaxisComponent', () => {
  let component: DialogInsertProfilaxisComponent;
  let fixture: ComponentFixture<DialogInsertProfilaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInsertProfilaxisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInsertProfilaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
