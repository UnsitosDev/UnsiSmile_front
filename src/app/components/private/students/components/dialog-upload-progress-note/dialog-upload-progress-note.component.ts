import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
interface ProgressNote {
  id: number;
  title: string;
  content: string;
  idProgressNote: string;
  bloodPressure: string;
  temperature: number;
  heartRate: number;
  respirationRate: number;
  oxygenSaturation: number;
  diagnosis: string;
  prognosis: string;
  treatment: string;
  indications: string;
  student: string;
  professor: string;
  files: any[];
  patient: {
    idPatient: string;
    name: string;
    birthDate: [number, number, number];
    age: number;
    origin: string;
    medicalRecordNumber: number;
    creationDate: [number, number, number];
    isMinor: boolean;
    guardian: string | null;
  };
  creationDate: string;
}

@Component({
  selector: 'app-dialog-upload-progress-note',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dialog-upload-progress-note.component.html',
  styleUrl: './dialog-upload-progress-note.component.scss'
})
export class DialogUploadProgressNoteComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogUploadProgressNoteComponent>);
  apiService = inject(ApiService);  
  private toastr = inject(ToastrService); 
  file: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { idProgressNote: string }) { }

  ngOnInit(): void {
    console.log();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  sendFile() {
    if (!this.file) {
      this.toastr.warning('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('progressNoteFiles', this.file);
    formData.append('progressNoteId', this.data.idProgressNote.toString());

    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Accept': 'application/json'
        }),
        url: `${UriConstants.POST_EVOLUTION_NOTE_FILE}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Nota guardada');
          this.closeDialog();
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }
}
