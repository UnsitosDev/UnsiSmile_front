import { HttpHeaders } from "@angular/common/http";
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Params } from "@angular/router";
import {
  CodigoTooth,
  DeanIndexResponse,
  DentalTreatmentPayload,
  FluorosisResponse,
  ID_TREATMENT_DETAIL,
  IOdontogramHandler,
  ITooth
} from "@mean/models";
import { TokenData } from "@mean/public";
import { ApiService, AuthService, createOdontogramHandler } from "@mean/services";
import { ROLES, UriConstants } from '@mean/utils';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-fluorosis',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, FormsModule, MatCardTitle, MatDivider],
  templateUrl: './fluorosis.component.html',
  styleUrl: './fluorosis.component.scss'
})
export class FluorosisComponent {
  @Input({ required: true }) patientUuid!: string;
  @Input({ required: true }) idPatientMedicalRecord!: number;
  @Input({ required: true }) idFormSection!: string | null;
  @Input({ required: true }) readonlyTreatment: boolean = false;    // Indica si el tratamiento es de solo lectura

  @Output() nextMatTab = new EventEmitter<void>();                  // Emite evento para avanzar a la siguiente pestaña
  @Output() previousMatTab = new EventEmitter<void>();              // Emite evento para retroceder a la pestaña anterior

  private readonly apiService = inject(ApiService);                 // Servicio para realizar peticiones a la API
  private readonly userService = inject(AuthService);               // Servicio de autenticación y obtención de datos del usuario
  private readonly router = inject(ActivatedRoute);                 // Servicio para obtener parámetros de la ruta
  private readonly toastr = inject(ToastrService);                  // Servicio para mostrar notificaciones

  public idTreatmentDetail!: number;                                // Id detalle tratamiento
  public fluorosis: IOdontogramHandler = createOdontogramHandler(); // Manejador para obtener los dientes
  public fluorosisResponse!: FluorosisResponse;                     // Guardar respuesta de Fluorosis
  public deanIndex!: DeanIndexResponse;                             // Guardar respuesta de DeanIndexResponse
  public selectedFaces: { [key: string]: boolean } = {};            // Caras seleccionadas
  public toothDeactivated: { [key: number]: boolean } = {};         // Dientes desactivados

  public role!: string;                                             // Rol del usuario autenticado
  private token!: string;
  private tokenData!: TokenData;

  public enableSaveButtonFluorosis: boolean = true;                 // Controla habilitación del botón para guardar fluorosis
  public enableSaveDeanIndex: boolean = false;                      // Controla habilitación del botón para guardar índice de Dean
  public isReadOnlyMode: boolean = false;                           // Indica si el modo es solo lectura
  public tableEditable: boolean = true;                             // Tabla editable
  ROL = ROLES;

  toothCode = ['D13', 'D12', 'D11', 'D21', 'D22', 'D23'];            // Códigos de dientes visibles en la tabla

  selectedValues: string[] = this.toothCode.map(pair => pair[0]);    // Valores seleccionados por diente
  codes: { [key: string]: CodigoTooth } = {};                        // Códigos de fluorosis por diente

  ngOnInit() {
    this.initializeUserRole();
    this.routeParams();
    this.fetchFluorosis();
    this.fetchDeanIndex();
  }

  // Obtiene el parámetro idTreatmentDetail desde la ruta
  public routeParams(): void {
    this.router.params.subscribe((params: Params) => {
      this.idTreatmentDetail = params[ID_TREATMENT_DETAIL]
    })
  }

  // Inicializa el rol del usuario autenticado
  private initializeUserRole(): void {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
    this.contentEditable(this.role);
  }

  public contentEditable(role: string){
    if(role !== this.ROL.STUDENT || this.readonlyTreatment){
      this.tableEditable = false;
      this.enableSaveButtonFluorosis = false;
      this.isReadOnlyMode = true;
      this.enableSaveDeanIndex = true;
    }
  }

  // Verifica si una cara ha sido seleccionada
  public isSelected(faceId: string): boolean {
    return this.selectedFaces[faceId];
  }

  // Alterna el estado de color (selección) de una cara
  public changeColor(faceId: string): void {
    this.selectedFaces[faceId] = !this.selectedFaces[faceId];
  }

  // Retorna dientes del cuadrante adulto especificado
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

  // Retorna dientes del cuadrante infantil especificado
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

  // Valida la entrada en celdas de la tabla y muestra advertencia si es inválida
  public validateInput(event: Event, toothNumber: string) {
    const input = event.target as HTMLElement;
    const value = parseInt(input.innerText);

    const validCodes = Object.values(CodigoTooth)                                     // Convierte enum a array de valores válidos
      .filter(v => typeof v === 'number') as number[];

    if (!validCodes.includes(value)) {                                                // Verifica si el código ingresado es válido
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
    selectedData.forEach(({ toothId, faceNumber }) => {
      if (!teethMap.has(toothId)) {
        teethMap.set(toothId, { idTooth: toothId, faces: [] });
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

  // Envía el payload de fluorosis al backend
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

  // Obtiene los datos guardados de fluorosis
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
          this.enableSaveButtonFluorosis = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // Inicializa datos de fluorosis y activa solo lectura
  private initializeSelectedData(response: FluorosisResponse): void {
    this.selectedFaces = {};                                              // Limpiar selecciones anteriores
    response.teethFluorosis.forEach(tooth => {                            // Mapear los datos de fluorosis a selectedFaces
      tooth.faces.forEach(face => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = true;
      });
    });
    this.isReadOnlyMode = true;
  }

  // Construye el payload para el Índice de Dean
  public store() {
    const payload: DentalTreatmentPayload = {
      idTreatment: Number(this.idTreatmentDetail),
      teeth: []
    };

    this.toothCode.forEach(tooth => {
      if (this.codes[tooth] !== undefined) {
        payload.teeth.push({
          idTooth: tooth,
          code: this.codes[tooth]
        });
      }
    });
    this.sendDeanIndex(payload);
  }

  // Envía el Índice de Dean al backend
  public sendDeanIndex(payload: DentalTreatmentPayload) {
    this.apiService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_DEAN_INDEX}`,
        data: payload,
      })
      .subscribe({
        next: (response) => {
          this.toastr.success('Indice de dean guardado correctamente');
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error);
        },
      });
  }

  // Obtiene los datos guardados del Índice de Dean
  public fetchDeanIndex() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_DEAN_INDEX}/${this.idTreatmentDetail}`,
        data: {},
      })
      .subscribe({
        next: (response: DeanIndexResponse) => {
          this.deanIndex = response;
          this.enableSaveDeanIndex = true;
          this.processServerData(this.deanIndex);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  // Procesa datos del servidor y actualiza los códigos y selecciones
  private processServerData(data: DentalTreatmentPayload) {
    this.codes = {};                                            // Limpiar códigos previos
    data.teeth.forEach(tooth => {                               // Procesar datos del servidor
      this.codes[tooth.idTooth] = tooth.code;                   // Asignar código
      this.toothCode.forEach((pair, index) => {                 // Actualizar selección
        if (pair.includes(tooth.idTooth)) {
          this.selectedValues[index] = tooth.idTooth;
        }
      });
    });
    this.tableEditable = false;
  }

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }

}
