import {Component, Input} from '@angular/core';
import {createOdontogramHandler} from "@mean/services";
import {IOdontogramHandler, ITooth} from "@mean/models";
import {MatTabsModule} from "@angular/material/tabs";

@Component({
  selector: 'app-fluorosis',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './fluorosis.component.html',
  styleUrl: './fluorosis.component.scss'
})
export class FluorosisComponent {
  @Input({ required: true }) patientUuid!: string;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input({ required: true }) idFormSection!: number | null;

  public fluorosis: IOdontogramHandler = createOdontogramHandler();   // Obtener los dientes

  public selectedFaces: { [key: string]: boolean } = {};              // Faces seleccionados
  public toothDeactivated: { [key: number]: boolean } = {};           // Faces desactivadas

  ngOnInit() {
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

}
