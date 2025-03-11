import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadProgressNoteComponent } from './dialog-upload-progress-note.component';

describe('DialogUploadProgressNoteComponent', () => {
  let component: DialogUploadProgressNoteComponent;
  let fixture: ComponentFixture<DialogUploadProgressNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUploadProgressNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUploadProgressNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
