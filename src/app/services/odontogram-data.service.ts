import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { dentalCodeResponse } from '../models/models-students/dentalCode/dentalCode';
import { toothConditionResponse } from '../models/models-students/toothCondition/toothCondition';
import { ICondition } from '../models/shared/odontogram/odontogram';
import { UriConstants } from '../utils/uris.contants';
import { ApiService } from './api.service';
import { toothFaceConditionResponse } from '../models/models-students/toothFaceCondition/toothCondition';

@Injectable({
  providedIn: 'root',
})
export class OdontogramData {
  constructor() {}

  private dentalCodeService = inject(ApiService<dentalCodeResponse>);
  private toothConditionService = inject(ApiService<toothConditionResponse>);
  private toothFaceConditionService = inject(ApiService<toothFaceConditionResponse>);

  getToothCondition(): Observable<ICondition[]> {
    return this.toothConditionService
      .getListService({
        url: UriConstants.GET_TOOTH_CONDITION,
      })
      .pipe(map((data) => this.mapToothConditionsToOptions(data)));
  }
  
  getToothFaceCondition(): Observable<ICondition[]> {
    return this.toothFaceConditionService
      .getListService({
        url: UriConstants.GET_TOOTH_FACE_CONDITION,
      })
      .pipe(map((data) => this.mapToothFaceConditionsToOptions(data)));
  }   

  private mapToothConditionsToOptions(conditions: toothConditionResponse[]): ICondition[] {
    return conditions.map((condition) => {
      return {
        idCondition: condition.idToothCondition,
        condition: condition.description,
        description: ""
      };
    });
  }

  private mapToothFaceConditionsToOptions(conditions: toothFaceConditionResponse[]): ICondition[] {
    return conditions.map((condition) => {
      return {
        idCondition: condition.idToothFaceCondition,
        condition: condition.description,
        description: ""
      };
    });
  }
  
}
