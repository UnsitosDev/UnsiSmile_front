import { Component, OnInit } from '@angular/core';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent implements OnInit {
  teeth = storeProphylaxis.theetProphylaxis;
  toothDisabled: { [key: number]: boolean } = {};
  toothDeactivated: { [key: number]: boolean } = {};
  showTriangle: { [key: number]: boolean } = {};
  selectedFaces: { [key: string]: boolean } = {}; // Estado de las caras seleccionadas

  ngOnInit(): void {
    // Inicializamos el estado de cada diente y sus caras
    this.teeth.forEach((tooth) => {
      this.toothDisabled[tooth.idTooth] = true;
      this.toothDeactivated[tooth.idTooth] = false;
      this.showTriangle[tooth.idTooth] = false;

      // Inicializamos el estado de las caras
      tooth.faces.forEach((face) => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = false;
      });
    });
  }

  changeColor(faceId: string) {
    this.selectedFaces[faceId] = !this.selectedFaces[faceId];
    console.log("Caras seleccionadas: ", this.selectedFaces);
  }

  isSelected(faceId: string): boolean {
    return this.selectedFaces[faceId];
  }

  deleteTooth(idTooth: number) {
    this.toothDisabled[idTooth] = false;
    this.clearFacesForTooth(idTooth);
  }

  restoreTooth(idTooth: number) {
    this.toothDisabled[idTooth] = true;
  }

  clearFacesForTooth(idTooth: number) {
    this.teeth
      .find((tooth) => tooth.idTooth === idTooth)
      ?.faces.forEach((face) => {
        const faceId = `${idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = false;
      });
  }

  deactivateTooth(idTooth: number) {
    this.clearFacesForTooth(idTooth);
    this.toothDeactivated[idTooth] = !this.toothDeactivated[idTooth];
    this.showTriangle[idTooth] = this.toothDeactivated[idTooth];
  }

  getQuadrant(teeth: ThoothProphylaxis[], quadrant: number): ThoothProphylaxis[] {
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
        .sort((a, b) => {
          if (quadrant === 1 || quadrant === 4) {
            return b.idTooth - a.idTooth;
          } else {
            return a.idTooth - b.idTooth;
          }
        });
    } else {
      return [];
    }
  }
}