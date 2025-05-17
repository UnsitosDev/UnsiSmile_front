import { HttpHeaders } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';

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
  selector: 'app-dialog-info-progress-note',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatIconModule, MatDialogModule, MatDialogModule],
  templateUrl: './dialog-info-progress-note.component.html',
  styleUrl: './dialog-info-progress-note.component.scss'
})
export class DialogInfoProgressNoteComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogInfoProgressNoteComponent>);
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private idProgressNote!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { note: ProgressNote, patientId: string, patientData: cardPatient, medicalRecordNumber: number, progressNoteData: any }) { }

  ngOnInit(): void {
    this.idProgressNote = this.data.note.idProgressNote;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  formatBirthDate(birthDate: [number, number, number]): string {
    const [year, month, day] = birthDate;
    return `${day}/${month}/${year}`;
  }

  formatCreationDate(creationDate: string): string {
    const date = new Date(creationDate);
    return date.toLocaleString();
  }

  generatePdf(): void {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWNLOAD_EVOLUTION_NOTE}/${this.idProgressNote}`,
        data: {},
        responseType: 'blob',
      })
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: response.type || 'application/octet-stream' });

          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;

          link.download = 'Nota_de_evolución';

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }
}
