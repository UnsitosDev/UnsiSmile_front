import { Injectable, inject } from '@angular/core';
import { dentalCodeResponse } from '../components/private/students/components/students-general-history/models/dentalCode/dentalCode';
import { UriConstants } from '../utils/uris.contants';
import { toothConditionResponse } from './../components/private/students/components/students-general-history/models/toothCondition/toothCondition';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { ICondition } from '../models/shared/odontogram';

@Injectable({
  providedIn: 'root',
})
export class OdontogramData {
  constructor() {}

  private dentalCodeService = inject(ApiService<dentalCodeResponse>);
  private tootConditionService = inject(ApiService<toothConditionResponse>);

  getToothCondition(): Observable<ICondition[]> {
    return this.tootConditionService
      .getListService({
        url: UriConstants.GET_TOOTH_CONDITION,
      })
      .pipe(map((data) => this.mapOptions(data)));
  }

  private mapOptions(conditions: toothConditionResponse[]): ICondition[] {
    return conditions.map((condition) => {
      return {
        idCondition: condition.idToothCondition,
        condition: condition.description,
        description: ""
      };
    });
  }

  private getCssById(id: String): string {
    switch (id) {
      case '41':
      case '51':
      case '81':
      case '11':
      case '31':
      case '71':
        return 'spaceRight';
      case '65':
      case '28':
      case '48':
        return 'noMarginRight';

      case '75':
      case '38':
        return 'clear';

      default:
        return '';
    }
  }
}
