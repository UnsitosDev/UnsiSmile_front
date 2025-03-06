import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { DialogInsertProgressNoteComponent } from '../dialog-insert-progress-note/dialog-insert-progress-note.component';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { TabsHandler } from '@mean/shared';
import { DialogInfoProgressNoteComponent } from '../dialog-info-progress-note/dialog-info-progress-note.component';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { DialogUploadProgressNoteComponent } from '../dialog-upload-progress-note/dialog-upload-progress-note.component';
import { ToastrService } from 'ngx-toastr';

interface ProgressNote {
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
  files: ProgressNoteFile[] | null;
  patient: Patient;
  creationDate: string;
}

interface ProgressNoteFile {
  idProgressNoteFile: string;
  fileName: string;
  extension: string;
  url: string;
}
@Component({
  selector: 'app-progress-notes',
  standalone: true,
  imports: [MatDividerModule, MatListModule, MatIconModule, CommonModule],
  templateUrl: './progress-notes.component.html',
  styleUrl: './progress-notes.component.scss'
})

export class ProgressNotesComponent implements OnInit, TabsHandler {
  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  @Output() nextMatTab = new EventEmitter<void>();
  @Output() previousMatTab = new EventEmitter<void>();
  @Input({ required: true }) patientId!: string;
  @Input({ required: true }) data!: cardPatient;
  @Input({ required: true }) medicalRecordNumber!: number;
  private toastr = inject(ToastrService);
  apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  progressNotesData: PaginatedData<ProgressNote> | null = null;

  ngOnInit(): void {
    this.getProgressNotes();
  }

  public getProgressNotes() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PAGINATED_EVOLUTION_NOTES}/${this.patientId}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.progressNotesData = response;
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogInsertProgressNoteComponent, {
      disableClose: true,
      data: { patientId: this.patientId },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  viewNote(note: ProgressNote) {
    const dialogRef = this.dialog.open(DialogInfoProgressNoteComponent, {
      disableClose: true,
      data: { note, patientId: this.patientId, patientData: this.data, medicalRecordNumber: this.medicalRecordNumber, progressNoteData: this.progressNotesData },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  attachDocument(note: ProgressNote) {
    const dialogRef = this.dialog.open(DialogUploadProgressNoteComponent, {
      disableClose: true,
      data: note,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  downloadFile(idProgressNoteFile: string) {
    this.apiService
      .getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.DOWNLOAD_EVOLUTION_NOTE}/${idProgressNoteFile}`,
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
  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }
}