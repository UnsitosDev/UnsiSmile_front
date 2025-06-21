import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@mean/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-authorization-treatment',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDialogModule, FormsModule, MatFormFieldModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dialog-authorization-treatment.component.html',
  styleUrl: './dialog-authorization-treatment.component.scss'
})
export class DialogAuthorizationTreatmentComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DialogAuthorizationTreatmentComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  public comment: string = '';
  public NOT_APPROVE = STATUS_TREATMENTS.NOT_APPROVED;  
  ngOnInit(): void {
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public rejectedTreatment() {
    if (!this.comment?.trim()) {
      this.toastr.warning('Agrega observaciones');
      return;
    }

    this.apiService.patchService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.PATCH_AUTHORIZATION_TREATMENT}/${this.data.idTreatmentDetail}/status`, 
      data: {
        status:  this.NOT_APPROVE,
        comments: this.comment
      },
    }).subscribe({
      next: (response) => {
        this.toastr.success('Tratamiento rechazado');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message);
      }
    });
  }
}
