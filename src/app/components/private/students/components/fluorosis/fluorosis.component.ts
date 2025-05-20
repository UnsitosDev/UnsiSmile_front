import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardTitle } from "@angular/material/card";
import { MatOption } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  CodigoTooth,
  DentalTreatmentPayload,
  ID_TREATMENT_DETAIL,
  IOdontogramHandler,
  ITooth
} from "@mean/models";
import { TokenData } from "@mean/public";
import { ApiService, AuthService, createOdontogramHandler } from "@mean/services";
import { ROLES } from '@mean/utils';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-fluorosis',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, FormsModule, MatCardTitle, MatOption, MatSelect],
  templateUrl: './fluorosis.component.html',
  styleUrl: './fluorosis.component.scss'
})
export class FluorosisComponent {
  @Input({ required: true }) patientUuid!: string;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input({ required: true }) idFormSection!: number | null;

  @Output() nextMatTab = new EventEmitter<void>();                  // Evento siguiente pestaña (Material)
  @Output() previousMatTab = new EventEmitter<void>();              // Evento pestaña anterior (Material)

  private readonly route = inject(Router);                          // Servicio de routing de Angular
  private readonly apiService = inject(ApiService);                 // Servicio para estado de historias clínica
  private readonly userService = inject(AuthService);               // Servicio de autenticación y roles
  private readonly router = inject(ActivatedRoute);                 // Servicio para obtener de la ruta idTreatmentDetail
  private readonly toastr = inject(ToastrService);                  // Servicio para mostrar mensajes
  public idTreatmentDetail!: number;
  public fluorosis: IOdontogramHandler = createOdontogramHandler(); // Obtener los dientes

  public selectedFaces: { [key: string]: boolean } = {};            // Faces seleccionados
  public toothDeactivated: { [key: number]: boolean } = {};         // Faces desactivadas

  public role!: string;                                             // Auth
  private token!: string;
  private tokenData!: TokenData;

  public enabledButton: boolean = true;                              // Control de habilitación de botones
  ROL = ROLES;

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

  ngOnInit() {
    this.initializeUserRole();
    this.routeParams();
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

  validateInput(event: Event, toothNumber: string) {
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

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }

}
