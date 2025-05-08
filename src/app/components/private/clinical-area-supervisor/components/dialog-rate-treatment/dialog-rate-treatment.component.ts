import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { ApiService } from '@mean/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-rate-treatment',
  standalone: true,
  imports: [MatRadioModule, MatCardModule, MatButtonModule],
  templateUrl: './dialog-rate-treatment.component.html',
  styleUrl: './dialog-rate-treatment.component.scss'
})
export class DialogRateTreatmentComponent {
  readonly dialogRef = inject(MatDialogRef<DialogRateTreatmentComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly apiService = inject(ApiService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  private idTreatmentDetail!: number;
  private selectedStatus: string = '';  
  public STATUS = STATUS_TREATMENTS;
  

  ngOnInit() {
    this.idTreatmentDetail = this.data.idTreatmentDetail;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onStatusChange(event: MatRadioChange) {
    this.selectedStatus = event.value;
  }

  rateTreatment() {
    if (!this.selectedStatus) {
      this.toastr.warning('Por favor selecciona una opción');
      return;
    }

    this.apiService.patchService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.POST_RATE_TREATMENT}/${this.idTreatmentDetail}/status?status=${this.selectedStatus}`,
      data: {},
    }).subscribe({
      next: (response) => {
        this.toastr.success('Tratamiento calificado');
        this.router.navigate(['/clinical-area-supervisor/review-treatment']);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al calificar el tratamiento');
      }
    });
  }

}
