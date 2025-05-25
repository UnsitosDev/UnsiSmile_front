import {HttpHeaders} from '@angular/common/http';
import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';
import {ApiService} from '@mean/services';
import {UriConstants} from '@mean/utils';
import {ToastrService} from 'ngx-toastr';
import {Messages} from 'src/app/utils/messageConfirmLeave';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {FileData} from '@mean/models';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
  selector: 'app-admin-files-section',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './admin-files-section.component.html',
  styleUrl: './admin-files-section.component.scss'
})

export class AdminFilesSectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private formSection = 53; // Seccion formatos legales y consentimientos
  public filesData: FileData[] = [];

  files: File[] = [];
  showFiles = true;

  ngOnInit(): void {
    this.getAllFormats();
  }

  getAllFormats() {
    this.apiService
      .getService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.GET_FORMATS}`,
        data: {},
      })
      .subscribe({
        next: (response: FileData[]) => {
          this.filesData = response;
        },
        error: (error) => {
          this.filesData = [];
          error.status === 404
            ? this.toastr.warning(Messages.NO_FILES_YET)
            : this.toastr.error();
        },
      });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.files = Array.from(files);
    }
  }

  sendFiles() {
    if (this.files.length === 0) {
      this.toastr.warning(Messages.WARNING_NO_FILE_SELECTED_FILES);
      return;
    }

    const formData = new FormData();

    this.files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('idQuestion', '243');

    this.apiService
      .postService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.POST_GENERAL_FILES}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.getAllFormats();
          this.toastr.success(Messages.SUCCESS_FILE);

          // Limpiar el input y la lista de archivos
          this.fileInput.nativeElement.value = '';
          this.files = [];
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  dialogDeleteFile(idFile: string) {
    const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
      width: '300px',
      data: {idFile},
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.getAllFormats();
      } else {
        console.log('El archivo no fue eliminado o el diálogo fue cancelado.');
      }
    });
  }

  onFileClick(file: any) {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.DOWLOAD_FILES}${file.idFile}`,
        data: {},
        responseType: 'blob'
      })
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], {type: response.type || 'application/octet-stream'});

          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = file.fileName || 'downloaded-file';

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

@Component({
  selector: 'dialog-delete-file',
  templateUrl: 'dialog-delete-file.html',
  styleUrl: './admin-files-section.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent],
})
export class DialogDeleteFileComponent {
  readonly dialogRef = inject(MatDialogRef<DialogDeleteFileComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly apiService = inject(ApiService);
  private readonly toastr = inject(ToastrService);
  isLoading = false;

  deleteFile() {
    this.isLoading = true;

    this.apiService.deleteService({
      headers: new HttpHeaders({}),
      url: `${UriConstants.DELETE_FILE_GENERAL}/${this.data.idFile}`,
      data: {},
    }).subscribe({
      next: () => {
        this.toastr.success('Se eliminó el archivo');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.toastr.error(error.message);
        this.dialogRef.close(false);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}

