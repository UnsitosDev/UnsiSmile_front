import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';

@Component({
  selector: 'app-admin-files-section',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './admin-files-section.component.html',
  styleUrl: './admin-files-section.component.scss'
})
export class AdminFilesSectionComponent {
  private toastr = inject(ToastrService);
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  files: File[] = [];
  showFiles = true;
  
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.files = Array.from(files);
    }
  }
  
  sendFiles() {
    if (this.files.length === 0) {
      this.toastr.warning(Messages.WARNING_NO_FILE_SELECTED_FORMATS);
      return;
    }
  
    const formData = new FormData();
  
    this.files.forEach((file) => {
      formData.append('files', file); 
    });
  
    // Agrega el idQuestion al FormData
    formData.append('idQuestion', '244');
  
    this.apiService
      .postService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.POST_GENERAL_FILES}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success(Messages.SUCCESS_FORMATS);
          this.router.navigate(['/admin/upload-files']);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }
}