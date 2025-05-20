import {HttpHeaders} from '@angular/common/http';
import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {ApiService} from '@mean/services';
import {UriConstants} from '@mean/utils';
import {ToastrService} from 'ngx-toastr';
import {PaginatedData} from 'src/app/models/shared/pagination/pagination';
import {DentalProphylaxis} from 'src/app/models/shared/prophylaxis/prophylaxis.response.model';
import {DialogInsertProfilaxisComponent} from '../dialog-insert-profilaxis/dialog-insert-profilaxis.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatCardTitle} from "@angular/material/card";
import {CodigoTooth, DentalTreatmentPayload, ID_TREATMENT_DETAIL} from "@mean/models";
import {ActivatedRoute, Params} from "@angular/router";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatExpansionModule, MatButtonModule, MatMenuModule, MatSelectModule, FormsModule, MatCardTitle, MatDivider],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss',
})
export class ProfilaxisComponent implements OnInit {
  @Input({required: true}) idPatient!: string;
  @Input({required: true}) idPatientClinicalHistory!: number;
  @Input({required: true}) idFormSection!: number;
  @Output() nextMatTab = new EventEmitter<void>();
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  public toastr = inject(ToastrService);
  private readonly router = inject(ActivatedRoute);                 // Servicio para obtener de la ruta idTreatmentDetail
  public idTreatmentDetail!: number;
  public registerProfilaxis!: PaginatedData<DentalProphylaxis>;
  public indexPage: number = 0;
  idQuestion: number = 244;
  toothPairs = [
    ['D16', 'D17'],
    ['D11', 'D21'],
    ['D26', 'D27'],
    ['D36', 'D37'],
    ['D31', 'D41'],
    ['D46', 'D47']
  ];

  selectedValues: string[] = this.toothPairs.map(pair => pair[0]);
  codes: { [key: string]: CodigoTooth } = {};

  ngOnInit(): void {
    this.getProphylaxis();
    this.routeParams();
  }

  public routeParams(): void {
    this.router.params.subscribe((params: Params) => {
      this.idTreatmentDetail = params[ID_TREATMENT_DETAIL]
    })
  }

  openInsertProphylaxis() {
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
      if (result) {
        this.getProphylaxis(this.indexPage, true);
      }
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
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        },
      });
  }

  nextTab() {
    this.nextMatTab.emit();
  }

  // Función para encontrar un diente específico en los datos
  findTooth(teeth: any[], toothNumber: number): any | null {
    return teeth.find(t => parseInt(t.idTooth) === toothNumber) || null;
  }

  formatDate(date: string): string {
    const fecha = new Date(date);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
  }

  public validateInput(event: Event, toothNumber: string) {
    const input = event.target as HTMLElement;
    const value = parseInt(input.innerText);

    const validCodes = Object.values(CodigoTooth)                                     // Convertir el enum a array de valores numéricos válidos
      .filter(v => typeof v === 'number') as number[];

    if (!validCodes.includes(value)) {                                                // Verificar si el valor está en los códigos válidos
      input.innerText = '';
      this.toastr.warning('Código inválido. Valores permitidos: 0, 1, 2, 3, 4');
    } else {
      this.codes[toothNumber] = value as CodigoTooth;
    }
  }

  public store(): DentalTreatmentPayload {
    const payload: DentalTreatmentPayload = {
      idTreatment: Number(this.idTreatmentDetail),
      teeth: []
    };

    this.selectedValues.forEach(idTooth => {
      if (this.codes[idTooth] !== undefined) {
        payload.teeth.push({
          idTooth: idTooth.toString(),
          code: this.codes[idTooth]
        });
      }
    });

    console.log('Payload completo:', payload);
    return payload;
  }

}

