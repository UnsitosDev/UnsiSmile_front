import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardTitle} from "@angular/material/card";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {
  CodigoTooth,
  DentalTreatmentPayload,
  FluorosisResponse,
  ID_TREATMENT_DETAIL,
  IOdontogramHandler,
  ITooth
} from "@mean/models";
import {TokenData} from "@mean/public";
import {ApiService, AuthService, createOdontogramHandler} from "@mean/services";
import {ROLES, UriConstants} from '@mean/utils';
import {ToastrService} from "ngx-toastr";
import {MatDivider} from "@angular/material/divider";
import {storeProphylaxis} from "../../../../../services/prophylaxis.service";
import {HttpHeaders} from "@angular/common/http";

interface ConditionFace {
  idToothFaceCondition: number;
  description: string;
}

@Component({
  selector: 'app-fluorosis',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, FormsModule, MatCardTitle, MatOption, MatSelect, MatDivider],
  templateUrl: './fluorosis.component.html',
  styleUrl: './fluorosis.component.scss'
})
export class FluorosisComponent {
  @Input({required: true}) patientUuid!: string;
  @Input({required: true}) idPatientClinicalHistory!: number;
  @Input({required: true}) idFormSection!: number | null;

  @Output() nextMatTab = new EventEmitter<void>();                  // Evento siguiente pestaña (Material)
  @Output() previousMatTab = new EventEmitter<void>();              // Evento pestaña anterior (Material)

  private readonly route = inject(Router);                          // Servicio de routing de Angular
  private readonly apiService = inject(ApiService);                 // Servicio para estado de historias clínica
  private readonly userService = inject(AuthService);               // Servicio de autenticación y roles
  private readonly router = inject(ActivatedRoute);                 // Servicio para obtener de la ruta idTreatmentDetail
  private readonly toastr = inject(ToastrService);                  // Servicio para mostrar mensajes
  public idTreatmentDetail!: number;
  public fluorosis: IOdontogramHandler = createOdontogramHandler(); // Obtener los dientes
  public fluorosisResponse!: FluorosisResponse;
  teeth = storeProphylaxis.theetProphylaxis;
  faceConditions!: ConditionFace[];
  public selectedFaces: { [key: string]: boolean } = {};            // Faces seleccionados
  public toothDeactivated: { [key: number]: boolean } = {};         // Faces desactivadas

  public role!: string;                                             // Auth
  private token!: string;
  private tokenData!: TokenData;

  public enabledButton: boolean = true;                              // Control de habilitación de botones
  ROL = ROLES;

  // Pares de dientes
  toothPairs = [
    ['D16', 'D17'],
    ['D11', 'D21'],
    ['D26', 'D27'],
    ['D36', 'D37'],
    ['D31', 'D41'],
    ['D46', 'D47']
  ];

  selectedValues: string[] = this.toothPairs.map(pair => pair[0]);    // Diente seleccionado
  codes: { [key: string]: CodigoTooth } = {};                         // Codigo de dientes

  ngOnInit() {
    this.initializeUserRole();
    this.routeParams();
    this.fetchFluorosis();
  }

  // Obtener idTreatmentDetail de la ruta
  public routeParams(): void {
    this.router.params.subscribe((params: Params) => {
      this.idTreatmentDetail = params[ID_TREATMENT_DETAIL]
    })
  }

  // Inicializar rol de usuario
  private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  // Selecciona un diente
  public isSelected(faceId: string): boolean {
    return this.selectedFaces[faceId];
  }

  // Maneja cambio de color
  changeColor(faceId: string): void {
    this.selectedFaces[faceId] = !this.selectedFaces[faceId];
  }

  // Cuadrantes para adulto
  public getQuadrant(teeth: ITooth[], quadrant: number): ITooth[] {
    if (quadrant >= 1 && quadrant <= 4) {
      return teeth
        .filter((tooth) => {
          const id = tooth.idTooth;
          switch (quadrant) {
            case 1:
              return id >= 11 && id <= 18;
            case 2:
              return id >= 21 && id <= 28;
            case 3:
              return id >= 31 && id <= 38;
            case 4:
              return id >= 41 && id <= 48;
            default:
              return false;
          }
        })
    } else {
      return [];
    }
  }

  // Cuadrantes para niño
  public getQuadrantForChildren(teeth: ITooth[], quadrant: number): ITooth[] {
    if (quadrant >= 5 && quadrant <= 8) {
      return teeth
        .filter((tooth) => {
          const id = tooth.idTooth;
          switch (quadrant) {
            case 5:
              return id >= 51 && id <= 55;
            case 6:
              return id >= 61 && id <= 65;
            case 7:
              return id >= 71 && id <= 75;
            case 8:
              return id >= 81 && id <= 85;
            default:
              return false;
          }
        })
    } else {
      return [];
    }
  }

  // Validación para celdas de la tabla
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

  /**
   * Obtiene los dientes y caras seleccionadas con fluorosis
   * @returns Array de objetos con toothId y faceNumber
   */
  private getSelectedTeethAndFaces(): { toothId: number, faceNumber: number }[] {
    return Object.keys(this.selectedFaces)
      .filter(faceId => this.selectedFaces[faceId])
      .map(faceId => {
        const [toothId, faceNumber] = faceId.split('-');
        return {
          toothId: parseInt(toothId),
          faceNumber: parseInt(faceNumber)
        };
      });
  }

  /**
   * Agrupa las caras seleccionadas por diente
   * @param selectedData Array de dientes y caras seleccionadas
   * @returns Mapa con idTooth y array de faces
   */
  private groupFacesByTooth(selectedData: { toothId: number, faceNumber: number }[]):
    Map<number, { idTooth: number, faces: number[] }> {

    const teethMap = new Map<number, { idTooth: number, faces: number[] }>();
    selectedData.forEach(({toothId, faceNumber}) => {
      if (!teethMap.has(toothId)) {
        teethMap.set(toothId, {idTooth: toothId, faces: []});
      }
      teethMap.get(toothId)!.faces.push(faceNumber);
    });
    return teethMap;
  }

  /**
   * Construye el objeto fluorosis con la estructura requerida
   * @param teethMap Mapa de dientes y caras agrupadas
   * @returns Objeto payload completo
   */
  private buildFluorosisPayload(teethMap: Map<number, { idTooth: number, faces: number[] }>): any {
    return {
      theetFluorosis: Array.from(teethMap.values()).map(toothData => ({
        idTooth: toothData.idTooth,
        conditions: [],
        faces: toothData.faces.map(faceNumber => ({
          idFace: faceNumber,
          conditions: [{
            idToothFaceCondition: 1,
            description: "Fluorosis dental"
          }]
        }))
      })),
      idTreatmentDetail: this.idTreatmentDetail
    };
  }

  public sendFluorosisPayload() {
    const selectedData = this.getSelectedTeethAndFaces();
    const groupedData = this.groupFacesByTooth(selectedData);
    const payload = this.buildFluorosisPayload(groupedData);
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_FLUOROSIS}`,
        data: payload,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Fluorosis guardada correctamente');
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error);
        },
      });
  }

  public fetchFluorosis() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_FLUOROSIS_BY_PATIENT}/${this.idTreatmentDetail}`,
        data: {},
      })
      .subscribe({
        next: (response: FluorosisResponse) => {
          this.fluorosisResponse = response;
          this.initializeSelectedData(response);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error);
        },
      });
  }

  private initializeSelectedData(response: FluorosisResponse): void {
    this.selectedFaces = {};                                              // Limpiar selecciones anteriores
    response.teethFluorosis.forEach(tooth => {               // Mapear los datos de fluorosis a selectedFaces
      tooth.faces.forEach(face => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = true;
      });
    });
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

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }

}
