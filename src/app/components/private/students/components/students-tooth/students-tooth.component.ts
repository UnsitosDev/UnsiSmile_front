import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

interface Face {
  id: string;
  estado: string;
}

@Component({
  selector: 'app-students-tooth',
  standalone: true,
  imports: [NgClass],
  templateUrl: './students-tooth.component.html',
  styleUrl: './students-tooth.component.scss',
})
export class StudentsToothComponent {
  @Input() data: any;
  @Input() index: number = 0;
  @Input() color: string = 'withe';
  @Input() all: string = '';
  @Input() idCondition: number = 0;
  @Output() toggleTooth = new EventEmitter<any>();
  @Output() setFace = new EventEmitter<any>();

  faceClicked = 0;

  /**
   * Función invocada cuando se hace clic en un diente.
   * @param data Información de los pacientes y sus dientes.
   * @param index Índice del diente actual.
   * @param faceId Identificador del diente seleccionado.
   * @param all Variable de control opcional.
   */
  clicked(data: any, index: number, faceId: any, all: string, idCondition: number) {
    // Se emite un evento para configurar la cara con la información del diente seleccionado.
    this.setFace.emit({faceId: data.faces[index].id, index: index, data: data, all: all, idCondition: idCondition });
    this.faceClicked = index
    console.log('data', data);
    console.log('option selected: ' , idCondition);
  }

  getFacePoints(faceIndex: number): string {
    switch (faceIndex) {
      case 0:
        return '1,1 7,9 21,9 28,1';
      case 1:
        return '21,9 21,25 28,33 28,1';
      case 2:
        return '21,25 28,33 1,33 7,25';
      case 3:
        return '1,1 1,33 7,25 7,9';
      case 4:
        return '7,9 21,9 21,25 7,25';
      default:
        return '';
    }
  }
  
}
