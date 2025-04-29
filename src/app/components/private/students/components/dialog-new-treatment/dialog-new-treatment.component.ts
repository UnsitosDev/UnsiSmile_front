import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Treatments } from '@mean/models';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-new-treatment',
  standalone: true,
  imports: [MatListModule, MatDialogModule, MatCardModule],
  templateUrl: './dialog-new-treatment.component.html',
  styleUrl: './dialog-new-treatment.component.scss'
})
export class DialogNewTreatmentComponent {
  private dialogRef = inject(MatDialogRef<DialogNewTreatmentComponent>);
  private readonly apiService = inject(ApiService);
  public readonly troast = inject(ToastrService);
  public treatmentData!: Treatments[];

  ngOnInit(): void {
    this.fetchTreatmentData();    
  }

  closeDialog(){
    this.dialogRef.close();
  }

  fetchTreatmentData() {
    this.apiService
          .getService({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_TREATMENTS}`,
            data: {},
          })
          .subscribe({
            next: (response: Treatments[]) => {
              this.treatmentData = response;
            },
            error: (error) => {
              console.error(error);
            },
          });
  }

}
