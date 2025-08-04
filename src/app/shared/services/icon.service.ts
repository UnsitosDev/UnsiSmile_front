import { Injectable } from '@angular/core';
import { ToothConditionsConstants } from '@mean/utils';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconMap = new Map<string, string>([
    [ToothConditionsConstants.FISTULA, 'assets/svg/fistula.svg'],
    [ToothConditionsConstants.DIENTE_CON_FLUOROSIS, 'assets/svg/fluorosis.svg'],
    [ToothConditionsConstants.DIENTE_CON_HIPOPLASIA, 'assets/svg/hipoplasia.svg'],
    [ToothConditionsConstants.RESTO_RADICULAR, 'assets/svg/resto_radicular.svg'],
    [ToothConditionsConstants.DIENTE_EN_MAL_POSICION_DERECHA, 'assets/svg/flecha_derecha.svg'],
    [ToothConditionsConstants.DIENTE_EN_MAL_POSICION_IZQUIERDA, 'assets/svg/flecha_izquierda.svg'],
    [ToothConditionsConstants.DIENTE_PARCIALMENTE_ERUPCIONADO, 'assets/svg/erupcion.svg'],
    [ToothConditionsConstants.PROTESIS_REMOVIBLE, 'assets/svg/protesis_removible.svg'],
    [ToothConditionsConstants.PUENTE, 'assets/svg/puente.svg'],
    [ToothConditionsConstants.ENDODONCIA, 'assets/svg/endodoncia.svg'],
    [ToothConditionsConstants.DIENTE_EXTRAIDO, 'assets/svg/extraido.svg'],
    [ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_BANDA, 'assets/svg/mantenedor_banda.svg'],
    [ToothConditionsConstants.DIENTE_CARIADO, 'assets/svg/caries.svg'],
    [ToothConditionsConstants.DIENTE_CON_FRACTURA, 'assets/svg/fractura.svg'],
    [ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES, 'assets/svg/obturado_caries.svg'],
    [ToothConditionsConstants.DIENTE_OBTURADO, 'assets/svg/obturado.svg'],
    [ToothConditionsConstants.DIENTE_CON_CORONA, 'assets/svg/corona.svg'],
    [ToothConditionsConstants.MANTENEDOR_DE_ESPACIO_CON_CORONA, 'assets/svg/mantenedor_corona.svg'],
  ]);

  getIconPath(condition: string): string | null {
    return this.iconMap.get(condition) || null;
  }

  getIconTitle(condition: string): string {
    return condition || '';
  }
}
