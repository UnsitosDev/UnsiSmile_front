import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
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
  public authorized = false;
  ngOnInit(): void {
    console.log('Dialog data:', this.data.idTreatmentDetail);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public rejectedTreatment() {
    if (!this.comment?.trim()) {
      this.toastr.warning('Agrega observaciones');
      return;
    }

    const params = new URLSearchParams();
    params.set('authorized', this.authorized.toString());
    params.set('comment', this.comment);

    console.log('comentarios', this.comment);
    this.apiService.patchService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.PATCH_AUTHORIZATION_TREATMENT}/${this.data.idTreatmentDetail}/authorization?${params.toString()}`, 
      data: {},
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
