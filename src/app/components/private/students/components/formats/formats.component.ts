import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { FileData} from '@mean/models';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Messages } from 'src/app/utils/messageConfirmLeave';

@Component({
  selector: 'app-formats',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './formats.component.html',
  styleUrl: './formats.component.scss'
})
export class FormatsComponent implements OnInit {
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private formSection = 55;
  public filesData: FileData[] = [];

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
