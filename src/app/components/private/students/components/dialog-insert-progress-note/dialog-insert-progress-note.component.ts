import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { ProgressNotesService } from 'src/app/services/form-progress-notes.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dialog-insert-progress-note',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FieldComponentComponent, MatDividerModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dialog-insert-progress-note.component.html',
  styleUrl: './dialog-insert-progress-note.component.scss'
})
export class DialogInsertProgressNoteComponent implements OnInit {
  formGroup!: FormGroup;
  progressNotesForm: any[] = [];
  private formProgressNotes = inject(ProgressNotesService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DialogInsertProgressNoteComponent>);

  ngOnInit(): void {
    this.progressNotesForm = this.formProgressNotes.getFormProgressNotes();
    this.formGroup = this.fb.group({});
    this.progressNotesForm.forEach((field) => {
      this.formGroup.addControl(
        field.name,
        this.fb.control('', field.validators)
      );
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onInsert(): void {
    const formData = this.formGroup.value;
    console.log('Datos del formulario:', formData);
  }

}
