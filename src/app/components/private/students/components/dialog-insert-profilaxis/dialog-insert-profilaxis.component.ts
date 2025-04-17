import { DialogRef } from '@angular/cdk/dialog';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-dialog-insert-profilaxis',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dialog-insert-profilaxis.component.html',
  styleUrl: './dialog-insert-profilaxis.component.scss'
})
export class DialogInsertProfilaxisComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<DialogInsertProfilaxisComponent>);
  public data = inject(MAT_DIALOG_DATA);
  public idPatientClinicalHistory = this.data.idPatientClinicalHistory;
  public idFormSection = this.data.idFormSection;
  public idPatient = this.data.idPatient;
  private api = inject(ApiService);
  public toastr = inject(ToastrService);
  public toothConditions: ConditionTooth[] = [];
  public faceConditions: ConditionFace[] = [];
  public allprophylaxis!: PaginatedData<ThoothProphylaxis>;
  public registerProfilaxis: any;
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

  closeDialog(): void {
    this.dialogRef.close();
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

  public getQuadrant(teeth: ThoothProphylaxis[], quadrant: number): ThoothProphylaxis[] {
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
          console.log('toothConditions', this.toothConditions);
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

  public store() {
    if (this.hasAtLeastOneCondition()) {
      this.postProfilaxis();
    } else {
      this.toastr.warning('Debe seleccionar al menos una condición en caras o dientes');
    }
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
          this.dialogRef.close(true);
          this.toastr.success('Profilaxis guardada correctamente');
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
  }

  private hasAtLeastOneCondition(): boolean {
    return this.teeth.some(tooth => {
      const hasToothConditions = tooth.conditions.length > 0;
      
      const hasFaceConditions = tooth.faces.some(face => 
        face.conditions && face.conditions.length > 0
      );
      
      return hasToothConditions || hasFaceConditions;
    });
  }
}
