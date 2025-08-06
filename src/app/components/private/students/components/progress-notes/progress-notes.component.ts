import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService, AuthService } from 'src/app/shared/services';
import { TabsHandler } from '@mean/shared';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { PaginatedData } from 'src/app/shared/models/shared/pagination/pagination';
import { cardPatient } from 'src/app/shared/models/shared/patients/cardPatient';
import { Patient } from 'src/app/shared/models/shared/patients/patient/patient';
import { LoadingComponent } from "../../../../../shared/models/shared/loading/loading.component";
import { DialogInfoProgressNoteComponent } from '../dialog-info-progress-note/dialog-info-progress-note.component';
import { DialogInsertProgressNoteComponent } from '../dialog-insert-progress-note/dialog-insert-progress-note.component';
import { DialogUploadProgressNoteComponent } from '../dialog-upload-progress-note/dialog-upload-progress-note.component';

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
  imports: [MatTooltipModule, MatDividerModule, MatListModule, MatIconModule, CommonModule, MatIconModule, MatProgressSpinnerModule, LoadingComponent, MatButton],
  templateUrl: './progress-notes.component.html',
  styleUrl: './progress-notes.component.scss',
})
export class ProgressNotesComponent implements OnInit, TabsHandler {
  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  @Output() nextMatTab = new EventEmitter<void>();
  @Output() previousMatTab = new EventEmitter<void>();
  @Input({ required: true }) patientId!: string;
  @Input({ required: true }) data!: cardPatient;
  @Input({ required: true }) medicalRecordNumber!: number;
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  role!: string;
  currentPage: number = 0;
  isLastPage: boolean = false;
  isLoading: boolean = false;
  apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  progressNotesData: PaginatedData<ProgressNote> | null = null;

  ngOnInit(): void {
    this.getProgressNotes();
    this.getRole();
  }

  getRole() {
    this.token = this.userService.getToken() ?? "";
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }


  public getProgressNotes(page: number = 0, resetPagination: boolean = false) {
    if (resetPagination) {
      this.currentPage = 0;
      this.progressNotesData = null;
    }

    this.isLoading = true;

    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PAGINATED_EVOLUTION_NOTES}/${this.patientId}?page=${page}&size=10`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          if (!this.progressNotesData) {
            this.progressNotesData = response;
          } else {
            // Concatena los nuevos resultados con los existentes
            this.progressNotesData.content = [...this.progressNotesData.content, ...response.content];
            this.progressNotesData.pageable = response.pageable;
            this.progressNotesData.totalPages = response.totalPages;
          }
          this.isLoading = false;
          this.isLastPage = response.last;
        },
        error: (error) => {
          this.toastr.error(error);
          this.isLoading = false;
        },
      });
  }

  loadMore() {
    if (!this.isLoading && !this.isLastPage) {
      this.currentPage++;
      this.getProgressNotes(this.currentPage);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogInsertProgressNoteComponent, {
      disableClose: true,
      data: { patientId: this.patientId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProgressNotes(0, true);
    });
  }

  viewNote(note: ProgressNote) {
    const dialogRef = this.dialog.open(DialogInfoProgressNoteComponent, {
      disableClose: true,
      data: { note, patientId: this.patientId, patientData: this.data, medicalRecordNumber: this.medicalRecordNumber, progressNoteData: this.progressNotesData },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  attachDocument(note: ProgressNote) {
    const dialogRef = this.dialog.open(DialogUploadProgressNoteComponent, {
      disableClose: true,
      data: note,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProgressNotes(0, true);
    });
  }

  downloadFile(idProgressNoteFile: string) {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWLOAD_SIGNED_NOTES}/${idProgressNoteFile}/download`,
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

  dowloadFormat(idProgressNote: string   ): void {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWLOAD_FORMAT_PROGRESS_NOTES}/${idProgressNote}/generate-pdf`,
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
