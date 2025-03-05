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
  files: any[];
  patient: Patient;
  creationDate: string;
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
          console.log('Notas de evolución:', this.progressNotesData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  idFile: string = '';
  downloadNote() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWNLOAD_EVOLUTION_NOTE}/${this.idFile}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogInsertProgressNoteComponent, {
      disableClose: true,
      data: { patientId: this.patientId }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  viewNote(note: ProgressNote) {
      const dialogRef = this.dialog.open(DialogInfoProgressNoteComponent, {
        disableClose: true,
        data: note,
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });  
  }

  // Función para adjuntar un documento
  attachDocument(note: ProgressNote) {
    console.log('Adjuntar documento a la nota:', note);
    // Aquí puedes implementar la lógica para adjuntar un documento
  }

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }
}