import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FileData } from '@mean/models';

@Component({
  selector: 'app-admin-files-section',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './admin-files-section.component.html',
  styleUrl: './admin-files-section.component.scss'
})

export class AdminFilesSectionComponent implements OnInit {
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
        },
        error: (error) => {
          this.toastr.error(error);
        },
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
          const blob = new Blob([response], { type: response.type || 'application/octet-stream' });

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