import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInsertProgressNoteComponent } from './dialog-insert-progress-note.component';

describe('DialogInsertProgressNoteComponent', () => {
  let component: DialogInsertProgressNoteComponent;
  let fixture: ComponentFixture<DialogInsertProgressNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInsertProgressNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInsertProgressNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
