import { HttpHeaders } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { DialogInsertProfilaxisComponent } from '../dialog-insert-profilaxis/dialog-insert-profilaxis.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [MatIconModule, MatDialogModule],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss',
})
export class ProfilaxisComponent implements OnInit {
  private api = inject(ApiService);
  public toastr = inject(ToastrService);
  public allprophylaxis!: PaginatedData<ThoothProphylaxis>;
  public registerProfilaxis: any;
  readonly dialog = inject(MatDialog);
  @Input({ required: true }) idPatient!: string;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input({ required: true }) idFormSection!: number;
  idQuestion: number = 244;

  ngOnInit(): void {
    this.getProphylaxis();
    this.registerProfilaxis = [];
  }

  openInsertProphylaxis() {
    console.log('openInsertProphylaxis');
    const dialogRef = this.dialog.open(DialogInsertProfilaxisComponent, {
      disableClose: false,
      width: '1000vh',
      data: {
        idPatient: this.idPatient,
        idQuestion: this.idQuestion,
        idPatientClinicalHistory: this.idPatientClinicalHistory,
        idFormSection: this.idFormSection
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProphylaxis();
    });
  }

  // Función para verificar condiciones (ya existente)
  hasCondition(tooth: any, conditionName: string): boolean {
    return tooth?.conditions?.some((c: any) => c.condition === conditionName) || false;
  }

  // Función para verificar caras marcadas (ya existente)
  isFaceMarked(tooth: any, faceId: string): boolean {
    return tooth?.faces?.some((f: any) => f.idFace === faceId && f.conditions?.length > 0) || false;
  }

  public getProphylaxis() {
    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PROFILAXIS}/patients/${this.idPatient}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.allprophylaxis = response;
          this.registerProfilaxis = this.allprophylaxis.content;
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  // Función para encontrar un diente específico en los datos
  findTooth(teeth: any[], toothNumber: number): any | null {
    return teeth.find(t => parseInt(t.idTooth) === toothNumber) || null;
  }

}

