import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services';
import { STATUS_TREATMENTS, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-rate-treatment',
  standalone: true,
  imports: [MatRadioModule, MatCardModule, MatButtonModule, MatDialogModule, FormsModule, MatFormFieldModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dialog-rate-treatment.component.html',
  styleUrl: './dialog-rate-treatment.component.scss'
})
export class DialogRateTreatmentComponent {
  readonly dialogRef = inject(MatDialogRef<DialogRateTreatmentComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly apiService = inject(ApiService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  public comments: string = '';

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
      this.toastr.warning('Selecciona Rechazar o Aprobar');
      return;
    }

    if (!this.comments?.trim()) {
      this.toastr.warning('Agrega observaciones');
      return;
    }

    this.apiService.patchService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.POST_RATE_TREATMENT}/${this.idTreatmentDetail}/status`,
      data: {
        idExecutionReview: this.data.idStatus,
        status: this.selectedStatus,
        comments: this.comments
      },
    }).subscribe({
      next: (response) => {
        this.toastr.success('Tratamiento calificado');
        this.router.navigate(['/clinical-area-supervisor/review-treatment']);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.toastr.error('Error al calificar el tratamiento');
      }
    });
  }

}
