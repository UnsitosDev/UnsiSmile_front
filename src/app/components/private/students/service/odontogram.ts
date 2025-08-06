import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import {
    ICondition,
    IFace,
    IOdontogram,
    ITooth
} from 'src/app/shared/models/shared/odontogram/odontogram';
import { OdontogramData } from 'src/app/shared/services/odontogram-data.service';

@Injectable({
  providedIn: 'root'
})
export class OdontogramService {
  private odontogram: IOdontogram = { teeth: [], observations: ""};

  constructor(private odontogramData: OdontogramData) {}

  getOdontogram(): IOdontogram {
    return this.odontogram;
  }

  loadConditions(): Observable<{ toothConditions: ICondition[], toothFaceConditions: ICondition[] }> {
    return forkJoin({
      toothConditions: this.odontogramData.getToothCondition(),
      toothFaceConditions: this.odontogramData.getToothFaceCondition()
    });
  }

  findOrCreateTooth(toothId: number): ITooth {
    let tooth = this.odontogram.teeth.find((t) => t.idTooth === toothId);
    if (!tooth) {
      tooth = { idTooth: toothId, conditions: [], faces: [], status: true };
      this.odontogram.teeth.push(tooth);
    }
    return tooth;
  }

  findOrCreateFace(tooth: ITooth, faceId: string): IFace {
    let face = tooth.faces.find((f) => f.idFace === faceId);
    if (!face) {
      face = { idFace: faceId, conditions: [] };
      tooth.faces.push(face);
    }
    return face;
  }

  conditionExists(conditions: ICondition[], conditionId: number): boolean {
    return conditions.some((c) => c.idCondition === conditionId);
  }

  addCondition(conditions: ICondition[], condition: ICondition) {
    if (!this.conditionExists(conditions, condition.idCondition)) {
      conditions.push(condition);
    }
  }

  addConditionToTooth(toothId: number, condition: ICondition) {
    const tooth = this.findOrCreateTooth(toothId);
    this.addCondition(tooth.conditions, condition);
  }

  addConditionToFace(toothId: number, faceId: string, condition: ICondition) {
    const tooth = this.findOrCreateTooth(toothId);
    const face = this.findOrCreateFace(tooth, faceId);
    if (!face.conditions) {
      face.conditions = [];
    }
    this.addCondition(face.conditions, condition);
  }
}