import { Injectable, inject } from '@angular/core';
import { dentalCodeResponse } from '../components/private/students/components/students-general-history/models/dentalCode/dentalCode';
import { UriConstants } from '../utils/uris.contants';
import { toothConditionResponse } from './../components/private/students/components/students-general-history/models/toothCondition/toothCondition';
import { toothOptions, uiTooth } from './../models/shared/store';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OdontogramData {
  constructor() {}

  private dentalCodeService = inject(ApiService<dentalCodeResponse>);
  private tootConditionService = inject(ApiService<toothConditionResponse>);

  getToothCondition(): Observable<toothOptions[]> {
    return this.tootConditionService
      .getListService({
        url: UriConstants.GET_TOOTH_CONDITION,
      })
      .pipe(
        map(data => this.mapOptions(data))
      );
  }

  private mapOptions(conditions: toothConditionResponse[]): toothOptions[] {
    return conditions.map((condition) => {
      return {
        idCondition: condition.idToothCondition,
        nome: condition.description,
        uiTooth: this.getColorForCondition(condition.description),
      };
    });
  }

  private getColorForCondition(condition: string): uiTooth {
    switch (condition) {
      case 'Diente obturado con caries':
        return {
            cor: 'red',  
          };
      case 'Diente con fluorosis':
        return {
            cor: 'F',  
            icon: 'F',
          };
      case 'Diente con fractura':
        return {
            cor: 'F',  
            icon: 'F',
          };
      case 'Diente en mal posición':
        return {
            icon: '⤻',
            cor: '⤻',
          };
      case 'Diente extraido':
        return {
            icon: '△',  
            cor: '△',
          };
      case 'Diente cariado':
        return {
            cor: 'red',  
          };
      case 'Fístula':
        return {
            cor: 'red',  
          };
      case 'Puente':
        return {
            icon: '───',  
            cor: '───',
          };
      case 'Prótesis removible':
        return {
            icon: '──',  
            cor: 'pr',
          };
      case 'Diente con hipoplasia':
        return {
            icon: 'H',  
            cor: 'H',
          };
      case 'Mantenedor de espacio con corona':
        return {
            cor: 'E/C',
            icon: 'E/C',
          };
      case 'mantenedor de espacio con banda':
        return {
            icon: 'E/B',  
            cor: 'E/B',
          };
      case 'Diente con corona':
        return {
            cor: 'blue',  
          };
      case 'Diente obturado':
        return {
            cor: 'teal',  
          };
      case 'Diente parcialmente erupcionado':
        return {
            icon: '──',  
            cor: '──',
          };
      case 'Diente presente':
        return  {
            cor: '✓',
          icon: '✓',
          };
      default:
        return {
            cor: 'white',  
          }; // Default color if condition not found
    }
  }

  public getDentalCodes() {
    this.dentalCodeService
      .getListService({
        url: `${UriConstants.GET_DENTAL_CODE}`,
      })
      .subscribe({
        next: (data) => {
          // Accede a los datos
          console.log(data);
        },
        error: (error) => {},
      });
  }
}
