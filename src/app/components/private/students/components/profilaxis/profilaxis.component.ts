import { Component, OnInit } from '@angular/core';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss',
})
export class ProfilaxisComponent implements OnInit {
  teeth = storeProphylaxis.theetProphylaxis;
  toothDisabled: { [key: number]: boolean } = {};
  toothDeactivated: { [key: number]: boolean } = {};
  showTriangle: { [key: number]: boolean } = {};
  selectedFaces: { [key: string]: boolean } = {};
  TheetData: { [key: number]: ThoothProphylaxis } = {};

  ngOnInit(): void {
    this.teeth.forEach((tooth) => {
      this.toothDisabled[tooth.idTooth] = true;
      this.toothDeactivated[tooth.idTooth] = false;
      this.showTriangle[tooth.idTooth] = false;

      tooth.faces.forEach((face) => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = false;
      });
    });
  }

  isToothEnabled(idTooth: number): boolean {
    return this.toothDisabled[idTooth];
  }

  isToothDeactivated(idTooth: number): boolean {
    return this.toothDeactivated[idTooth];
  }

  toggleTriangleVisibility(idTooth: number): void {
    this.showTriangle[idTooth] = !this.showTriangle[idTooth];
  }

  changeColor(faceId: string): void {
    this.selectedFaces[faceId] = !this.selectedFaces[faceId];
    this.updateToothConditions();
  }

  isSelected(faceId: string): boolean {
    return this.selectedFaces[faceId];
  }

  deleteTooth(idTooth: number): void {
    this.toothDisabled[idTooth] = false;
    this.clearFacesForTooth(idTooth);
    this.updateToothConditions();
  }

  restoreTooth(idTooth: number): void {
    this.toothDisabled[idTooth] = true;
    this.updateToothConditions();
  }

  clearFacesForTooth(idTooth: number): void {
    this.teeth
      .find((tooth) => tooth.idTooth === idTooth)
      ?.faces.forEach((face) => {
        const faceId = `${idTooth}-${face.idFace}`;
        this.selectedFaces[faceId] = false;
      });
  }

  deactivateTooth(idTooth: number): void {
    this.clearFacesForTooth(idTooth);
    this.toothDeactivated[idTooth] = !this.toothDeactivated[idTooth];
    this.showTriangle[idTooth] = this.toothDeactivated[idTooth];
    this.updateToothConditions();
  }

  updateToothConditions(): void {
    this.teeth.forEach((tooth) => {
      if (!this.toothDisabled[tooth.idTooth]) {
        if (!tooth.conditions.some((cond) => cond.condition === 'no presente')) {
          tooth.conditions.push({
            idCondition: 13,
            condition: 'no presente',
            description: 'Diente no presente',
          });
        }
      } else {
        tooth.conditions = tooth.conditions.filter(
          (cond) => cond.condition !== 'no presente'
        );
      }

      if (this.toothDeactivated[tooth.idTooth]) {
        if (!tooth.conditions.some((cond) => cond.condition === 'extraído')) {
          tooth.conditions.push({
            idCondition: 3,
            condition: 'extraído',
            description: 'Diente extraído',
          });
        }
      } else {
        tooth.conditions = tooth.conditions.filter(
          (cond) => cond.condition !== 'extraído'
        );
      }

      tooth.faces.forEach((face) => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        if (this.selectedFaces[faceId]) {
          if (!face.conditions?.some((cond) => cond.condition === 'marcado')) {
            face.conditions = face.conditions || [];
            face.conditions.push({
              idCondition: 5,
              condition: 'marcado',
              description: '',
            });
          }
        } else {
          face.conditions = face.conditions?.filter(
            (cond) => cond.condition !== 'marcado'
          );
        }
      });

      this.updateTeeth(tooth);
    });
  }

  updateTeeth(tooth: ThoothProphylaxis): void {
    if (
      tooth.conditions.length > 0 ||
      tooth.faces.some((face) => face.conditions && face.conditions.length > 0)
    ) {
      this.TheetData[tooth.idTooth] = { ...tooth };
    } else {
      delete this.TheetData[tooth.idTooth];
    }
  }

  generateModifiedTeethObject(): void {
    const teethToPost = Object.values(this.TheetData);
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
