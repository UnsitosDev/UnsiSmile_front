import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInfoProgressNoteComponent } from './dialog-info-progress-note.component';

describe('DialogInfoProgressNoteComponent', () => {
  let component: DialogInfoProgressNoteComponent;
  let fixture: ComponentFixture<DialogInfoProgressNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInfoProgressNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInfoProgressNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
