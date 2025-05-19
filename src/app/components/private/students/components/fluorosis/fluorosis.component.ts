import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { IOdontogramHandler, ITooth } from "@mean/models";
import { TokenData } from "@mean/public";
import { ApiService, AuthService, createOdontogramHandler } from "@mean/services";
import { ROLES } from '@mean/utils';

@Component({
  selector: 'app-fluorosis',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule],
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

  public fluorosis: IOdontogramHandler = createOdontogramHandler(); // Obtener los dientes

  public selectedFaces: { [key: string]: boolean } = {};            // Faces seleccionados
  public toothDeactivated: { [key: number]: boolean } = {};         // Faces desactivadas

  public role!: string;                                             // Auth
  private token!: string;
  private tokenData!: TokenData;

  public enabledButton: boolean = true;                              // Control de habilitación de botones
  ROL = ROLES;

  ngOnInit() {
    this.initializeUserRole();
  }

  public store(){

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

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }

}
