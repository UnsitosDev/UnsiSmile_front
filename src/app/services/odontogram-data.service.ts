import { Injectable, inject } from '@angular/core';
import { dentalCodeResponse } from '../components/private/students/components/students-general-history/models/dentalCode/dentalCode';
import { UriConstants } from '../utils/uris.contants';
import { toothConditionResponse } from './../components/private/students/components/students-general-history/models/toothCondition/toothCondition';
import { tooth, toothOptions, uiTooth } from './../models/shared/store';
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

  private getColorForCondition(condition: string): uiTooth {
    switch (condition) {
      case 'Diente obturado con caries':
        return {
          color: 'red',
        };
      case 'Diente con fluorosis':
        return {
          color: 'F',
          icon: 'F',
        };
      case 'Diente con fractura':
        return {
          color: 'F',
          icon: 'F',
        };
      case 'Diente en mal posición':
        return {
          icon: '⤻',
          color: '⤻',
        };
      case 'Diente extraido':
        return {
          icon: '△',
          color: '△',
        };
      case 'Diente cariado':
        return {
          color: 'red',
        };
      case 'Fístula':
        return {
          color: 'red',
        };
      case 'Puente':
        return {
          icon: '───',
          color: '───',
        };
      case 'Prótesis removible':
        return {
          icon: '──',
          color: 'pr',
        };
      case 'Diente con hipoplasia':
        return {
          icon: 'H',
          color: 'H',
        };
      case 'Mantenedor de espacio con corona':
        return {
          color: 'E/C',
          icon: 'E/C',
        };
      case 'mantenedor de espacio con banda':
        return {
          icon: 'E/B',
          color: 'E/B',
        };
      case 'Diente con corona':
        return {
          color: 'blue',
        };
      case 'Diente obturado':
        return {
          color: 'teal',
        };
      case 'Diente parcialmente erupcionado':
        return {
          icon: '──',
          color: '──',
        };
      case 'Diente presente':
        return {
          color: '✓',
          icon: '✓',
        };
      default:
        return {
          color: 'white',
        }; // Default color if condition not found
    }
  }

  getDentalCodesOfAdults(): Observable<tooth[]> {
    return this.tootConditionService
      .getListService({
        url: UriConstants.GET_DENTAL_CODE,
      })
      .pipe(map((data) => this.mapDentalCodesOfAdults(data)));
  }

  private mapDentalCodesOfAdults(tooths: dentalCodeResponse[]): tooth[] {
    return tooths
      .filter((tooth) => tooth.adult)
      .map((tooth) => {
        return {
          id: tooth.idDentalCode,
          name: tooth.code,
          status: true,
          css: this.getCssById(tooth.code),
          faces: [
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
          ],
        };
      });
  }

  getDentalCodesOfChilds(): Observable<tooth[]> {
    return this.tootConditionService
      .getListService({
        url: UriConstants.GET_DENTAL_CODE,
      })
      .pipe(map((data) => this.mapDentalCodesOfChilds(data)));
  }

  private mapDentalCodesOfChilds(tooths: dentalCodeResponse[]): tooth[] {
    return tooths
      .filter((tooth) => !tooth.adult)
      .map((tooth) => {
        return {
          id: tooth.idDentalCode,
          name: tooth.code,
          status: true,
          css: this.getCssById(tooth.code),
          faces: [
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'withe',
              idCondition: 1,
            },
            {
              id: tooth.code,
              name: 'face',
              estado: 'white',
              idCondition: 1,
            },
          ],
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
