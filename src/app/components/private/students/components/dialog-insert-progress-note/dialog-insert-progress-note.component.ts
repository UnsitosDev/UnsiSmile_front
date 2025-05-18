import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { ProgressNotesService } from 'src/app/services/form-progress-notes.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import {LoadingComponent} from "@mean/shared";


@Component({
  selector: 'app-dialog-insert-progress-note',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FieldComponentComponent, MatDividerModule, MatButtonModule, MatIconModule, MatCardModule, LoadingComponent],
  templateUrl: './dialog-insert-progress-note.component.html',
  styleUrl: './dialog-insert-progress-note.component.scss'
})
export class DialogInsertProgressNoteComponent implements OnInit {
  formGroup!: FormGroup;
  progressNotesForm: any[] = [];
  apiService = inject(ApiService);
  private formProgressNotes = inject(ProgressNotesService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DialogInsertProgressNoteComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { patientId: string }) { }

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
    const formValues = this.formGroup.value;

    const formData = {
      ...formValues,
      patientId: this.data.patientId,
    };

    if (this.formGroup.valid) {
      this.apiService
        .postService({
          headers: new HttpHeaders({}),
          url: `${UriConstants.POST_EVOLUTION_NOTE}`,
          data: formData,
        })
        .subscribe({
          next: (response) => {
            this.closeDialog();
            this.toastr.success('Nota guardada');
          },
          error: (error) => {
            this.toastr.error(error);
          },
        });
    } else {
      this.markFormGroupTouched(this.formGroup);
      this.toastr.warning(Messages.WARNING_PROGRESS_NOTE, 'Advertencia');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
