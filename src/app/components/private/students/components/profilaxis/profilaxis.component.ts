import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatCardTitle } from "@angular/material/card";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from "@angular/material/divider";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Params } from "@angular/router";
import { CodigoTooth, DentalTreatmentPayload, ID_TREATMENT_DETAIL } from "@mean/models";
import { ApiService, AuthService } from '@mean/services';
import { ROLES, UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { DentalProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.response.model';
import { DialogInsertProfilaxisComponent } from '../dialog-insert-profilaxis/dialog-insert-profilaxis.component';
import { TokenData } from '@mean/public';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatExpansionModule, MatButtonModule, MatMenuModule, MatSelectModule, FormsModule, MatCardTitle, MatDivider],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss',
})
export class ProfilaxisComponent implements OnInit {
  @Input({ required: true }) idPatient!: string;
  @Input({ required: true }) idPatientMedicalRecord!: number;
  @Input({ required: true }) idFormSection!: string;
  @Input({ required: true }) readonlyTreatment: boolean = false; // Indica si el tratamiento es de solo lectura

  @Output() nextMatTab = new EventEmitter<void>();                // Evento para tab siguiente

  private readonly dialog = inject(MatDialog);                    // Servicio dialog material
  private readonly api = inject(ApiService);                      // ApiService
  public toastr = inject(ToastrService);                          // Servicio para mensajes
  private readonly router = inject(ActivatedRoute);               // Servicio para obtener de la ruta idTreatmentDetail
  private readonly userService = inject(AuthService);             // Servicio de autenticación y obtención de datos del usuario

  public role!: string;                                           // Rol del usuario autenticado
  private token!: string;
  private tokenData!: TokenData;

  public idTreatmentDetail!: number;                              // Id tratamiento
  public registerProfilaxis!: PaginatedData<DentalProphylaxis>;   // Sesiones profilaxis
  public responseIHOS!: DentalTreatmentPayload;                   // Respuesta para indice de higiene oral simplificado
  public showButtonIHOS: boolean = true;                          // estado para mostrar/ocultar btn guardar IHOS
  public tableEditable: boolean = true;                           // Tabla editable
  public newSessionButton: boolean = true;
  public indexPage: number = 0;
  public ROL = ROLES;

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
    this.initializeUserRole();
    this.routeParams();
    this.getProphylaxis();
    this.fetchIHOS();
  }

  public routeParams(): void {
    this.router.params.subscribe((params: Params) => {
      this.idTreatmentDetail = params[ID_TREATMENT_DETAIL]
    })
  }

   private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
    this.contentEditable(this.role);
  }

  public contentEditable(role: string){
    if (role !== this.ROL.STUDENT || this.readonlyTreatment) {
      this.showButtonIHOS = false;
      this.tableEditable = false;
      this.newSessionButton = false;
    }
  }

  openInsertProphylaxis() {
    const dialogRef = this.dialog.open(DialogInsertProfilaxisComponent, {
      disableClose: false,
      width: '1000vh',
      data: {
        idTreatmentDetail: this.idTreatmentDetail,
        idPatient: this.idPatient,
        idQuestion: this.idQuestion,
        idPatientMedicalRecord: this.idPatientMedicalRecord,
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
        url: `${UriConstants.GET_PROFILAXIS}/${this.idPatientMedicalRecord}?page=${page}&size=10`,
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

  public store() {
    const payload: DentalTreatmentPayload = {
      idPatientMedicalRecord: this.idPatientMedicalRecord,
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

    this.api
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_IHOS}`,
        data: payload,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('IHOS Guardado');
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  public fetchIHOS() {
    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_IHOS}/${this.idPatientMedicalRecord}`,
        data: {},
      })
      .subscribe({
        next: (response: DentalTreatmentPayload) => {
          this.responseIHOS = response;
          this.processServerData(this.responseIHOS);
          this.showButtonIHOS = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  private processServerData(data: DentalTreatmentPayload) {
    this.selectedValues = this.toothPairs.map(pair => pair[0]); // Inicializar selectedValues con los primeros valores de cada par
    this.codes = {};                                            // Limpiar códigos previos
    data.teeth.forEach(tooth => {                               // Procesar datos del servidor
      this.codes[tooth.idTooth] = tooth.code;                   // Asignar código
      this.toothPairs.forEach((pair, index) => {                // Actualizar selección si el diente está en nuestros pares
        if (pair.includes(tooth.idTooth)) {
          this.selectedValues[index] = tooth.idTooth;
        }
      });
    });
    this.tableEditable = false;
  }
}

