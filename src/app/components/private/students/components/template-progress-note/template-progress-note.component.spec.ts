import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateProgressNoteComponent } from './template-progress-note.component';

describe('TemplateProgressNoteComponent', () => {
  let component: TemplateProgressNoteComponent;
  let fixture: ComponentFixture<TemplateProgressNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateProgressNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplateProgressNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
