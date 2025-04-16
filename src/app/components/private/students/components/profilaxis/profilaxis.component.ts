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
import { DentalProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.response.model';

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
  public registerProfilaxis!: PaginatedData<DentalProphylaxis>;
  public indexPage: number = 0;
  readonly dialog = inject(MatDialog);
  @Input({ required: true }) idPatient!: string;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input({ required: true }) idFormSection!: number;
  idQuestion: number = 244;

  ngOnInit(): void {
    this.getProphylaxis();
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

  isLoading: boolean = false;
  isLastPage: boolean = false;

  loadMore() {
    if (!this.isLoading && !this.isLastPage) {
      this.indexPage++;
      this.getProphylaxis(this.indexPage);
    }
  }

  public getProphylaxis(page: number = 0, resetPagination: boolean = false) {
    if (resetPagination) {
      this.indexPage = 0;
      this.isLastPage = false;
    }

    this.isLoading = true;

    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PROFILAXIS}/patients/${this.idPatient}?page=${page}&size=10`,
        data: {},
      })
      .subscribe({
        next: (response: PaginatedData<DentalProphylaxis>) => {
          if (!this.registerProfilaxis || resetPagination) {
            // Primera carga o reset
            this.registerProfilaxis = response;
          } else {
            this.registerProfilaxis = {
              ...response,
              content: [...this.registerProfilaxis.content, ...response.content],
              last: response.last,
              number: response.number,
              pageable: response.pageable
            };
          }

          this.isLoading = false;
          this.isLastPage = response.last;
          console.log('Profilaxis data:', this.registerProfilaxis);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        },
      });
  }


  // Función para encontrar un diente específico en los datos
  findTooth(teeth: any[], toothNumber: number): any | null {
    return teeth.find(t => parseInt(t.idTooth) === toothNumber) || null;
  }

}

