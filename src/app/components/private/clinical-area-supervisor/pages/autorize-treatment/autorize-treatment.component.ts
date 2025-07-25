import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsGeneralHistoryComponent } from "@mean/students";
import { DialogAuthorizationTreatmentComponent } from '../../components/dialog-authorization-treatment/dialog-authorization-treatment.component';

@Component({
  selector: 'app-autorize-treatment',
  standalone: true,
  imports: [StudentsGeneralHistoryComponent, MatCardModule, MatButtonModule, MatTabsModule],
  templateUrl: './autorize-treatment.component.html',
  styleUrl: './autorize-treatment.component.scss'
})
export class AutorizeTreatmentComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public patientUuid!: string;
  public idTreatmentDetail!: number;

  ngOnInit() {
    this.patientUuid = this.route.snapshot.params['patientUuid']
    this.idTreatmentDetail = this.route.snapshot.params['idTreatmentDetail'];
  }

  public openDialogRejectTreatment() {
    const dialogRef = this.dialog.open(DialogAuthorizationTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
        title: '¿Está seguro de rechazar el tratamiento?',
        state: 'Rechazar'
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/clinical-area-supervisor/approval-treatments']);
      }
    });
  }

  public openDialogAproveTreatment() {
    const dialogRef = this.dialog.open(DialogAuthorizationTreatmentComponent, {
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
        title: '¿Está seguro de aprobar el tratamiento?',
        state: 'Aprobar'
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/clinical-area-supervisor/approval-treatments']);
      }
    });
  }
}
