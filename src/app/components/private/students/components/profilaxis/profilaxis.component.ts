import { HttpHeaders } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { ToastrService } from 'ngx-toastr';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';


interface ConditionFace {
  idToothFaceCondition: number;
  description: string;
}

interface ConditionTooth {
  idToothCondition: number;
  description: string;
}

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss',
})
export class ProfilaxisComponent implements OnInit {
  private api = inject(ApiService);
  public toastr = inject(ToastrService);
  public toothConditions: ConditionTooth[] = [];
  public faceConditions: ConditionFace[] = [];
  public allprophylaxis!: PaginatedData<ThoothProphylaxis>;
  public registerProfilaxis: any;
  @Input({ required: true }) idPatient!: string;
  @Input({ required: true }) idPatientClinicalHistory!: number;
  @Input({ required: true }) idFormSection!: number;
  idQuestion: number = 244;
  teeth = storeProphylaxis.theetProphylaxis;
  toothDisabled: { [key: number]: boolean } = {};
  toothDeactivated: { [key: number]: boolean } = {};
  showTriangle: { [key: number]: boolean } = {};
  selectedFaces: { [key: string]: boolean } = {};
  TheetData: { [key: number]: ThoothProphylaxis } = {};

  ngOnInit(): void {
    this.conditionsFace();
    this.conditionsTooth();
    this.disableAllTeeth();
    this.getProphylaxis();
    this.registerProfilaxis = [];
  }

  disableAllTeeth() {
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

  private updateToothConditions(): void {
    this.teeth.forEach((tooth) => {
      if (!this.toothDisabled[tooth.idTooth]) {
        const noPresenteCondition = this.toothConditions.find(
          (cond) => cond.description === 'Diente no presente'
        );
        if (noPresenteCondition && !tooth.conditions.some((cond) => cond.idCondition === noPresenteCondition.idToothCondition)) {
          tooth.conditions.push({
            idCondition: noPresenteCondition.idToothCondition,
            condition: 'no presente',
            description: noPresenteCondition.description,
          });
        }
      } else {
        const noPresenteCondition = this.toothConditions.find(
          (cond) => cond.description === 'Diente no presente'
        );
        if (noPresenteCondition) {
          tooth.conditions = tooth.conditions.filter(
            (cond) => cond.idCondition !== noPresenteCondition.idToothCondition
          );
        }
      }

      if (this.toothDeactivated[tooth.idTooth]) {
        const extraidoCondition = this.toothConditions.find(
          (cond) => cond.description === 'Diente extraido'
        );
        if (extraidoCondition && !tooth.conditions.some((cond) => cond.idCondition === extraidoCondition.idToothCondition)) {
          tooth.conditions.push({
            idCondition: extraidoCondition.idToothCondition,
            condition: 'extraído',
            description: extraidoCondition.description,
          });
        }
      } else {
        const extraidoCondition = this.toothConditions.find(
          (cond) => cond.description === 'Diente extraido'
        );
        if (extraidoCondition) {
          tooth.conditions = tooth.conditions.filter(
            (cond) => cond.idCondition !== extraidoCondition.idToothCondition
          );
        }
      }

      tooth.faces.forEach((face) => {
        const faceId = `${tooth.idTooth}-${face.idFace}`;
        if (this.selectedFaces[faceId]) {
          const marcadoCondition = this.faceConditions.find(
            (cond) => cond.description === 'Marcado'
          );
          if (marcadoCondition && !face.conditions?.some((cond) => cond.idCondition === marcadoCondition.idToothFaceCondition)) {
            face.conditions = face.conditions || [];
            face.conditions.push({
              idCondition: marcadoCondition.idToothFaceCondition,
              condition: 'marcado',
              description: marcadoCondition.description,
            });
          }
        } else {
          const marcadoCondition = this.faceConditions.find(
            (cond) => cond.description === 'Marcado'
          );
          if (marcadoCondition) {
            face.conditions = face.conditions?.filter(
              (cond) => cond.idCondition !== marcadoCondition.idToothFaceCondition
            );
          }
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

  // Función para verificar condiciones
  hasCondition(tooth: any, conditionName: string): boolean {
    return tooth.conditions?.some((c: any) => c.condition === conditionName) || false;
  }

  // Función para verificar caras marcadas
  isFaceMarked(tooth: any, faceId: string): boolean {
    return tooth.faces?.some((f: any) => f.idFace === faceId && f.conditions?.length > 0) || false;
  }

  // Función getQuadrant actualizada
  getQuadrantv2(teeth: any[], quadrant: number): any[] {
    return teeth.filter(tooth => {
      const toothNumber = parseInt(tooth.idTooth);
      switch (quadrant) {
        case 1: return toothNumber >= 11 && toothNumber <= 18;
        case 2: return toothNumber >= 21 && toothNumber <= 28;
        case 3: return toothNumber >= 31 && toothNumber <= 38;
        case 4: return toothNumber >= 41 && toothNumber <= 48;
        default: return false;
      }
    }).sort((a, b) => {
      const numA = parseInt(a.idTooth);
      const numB = parseInt(b.idTooth);
      return quadrant === 1 || quadrant === 4 ? numB - numA : numA - numB;
    });
  }
  public conditionsFace() {
    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CONDITION_PROFILAXIS_FACE}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.faceConditions = response;
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  public conditionsTooth() {
    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CONDITION_PROFILAXIS_TOOTH}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.toothConditions = response;
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  public getProphylaxis() {
    this.api
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PROFILAXIS}/patients/${this.idPatient}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.allprophylaxis = response;
          this.registerProfilaxis = this.allprophylaxis.content;
          console.log('p', this.registerProfilaxis);
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }


  generateModifiedTeethObject(): any {
    const teethWithConditions = this.teeth.filter(tooth => {
      const hasToothConditions = tooth.conditions.length > 0;
      const hasFaceConditions = tooth.faces.some(face =>
        face.conditions && face.conditions.length > 0
      );
      return hasToothConditions || hasFaceConditions;
    });

    const theetProphylaxis = teethWithConditions.map(tooth => ({
      idTooth: tooth.idTooth,
      conditions: tooth.conditions.map(condition => ({
        idCondition: condition.idCondition
      })),
      faces: tooth.faces.map(face => ({
        idFace: +face.idFace,
        conditions: face.conditions?.map(fc => ({
          idToothFaceCondition: fc.idCondition,
          description: this.faceConditions.find(f => f.idToothFaceCondition === fc.idCondition)?.description
        })) || []
      }))
    }));

    const payload = {
      theetProphylaxis,
      idPatient: this.idPatient,
      idQuestion: this.idQuestion,
      idPatientClinicalHistory: this.idPatientClinicalHistory,
      idFormSection: this.idFormSection
    };
    return payload;
  }

  store() {
    this.postProfilaxis();
  }

  postProfilaxis() {
    const payload = this.generateModifiedTeethObject();
    this.api
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POS_PROFILAXIS}`,
        data: payload,
      })
      .subscribe({
        next: (response) => {
          console.log('ok');
          this.getProphylaxis();
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }
}

