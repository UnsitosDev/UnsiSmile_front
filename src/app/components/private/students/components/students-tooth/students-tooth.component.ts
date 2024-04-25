import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  input,
} from '@angular/core';

interface Face {
  id: string;
  estado: string;
}

@Component({
  selector: 'app-students-tooth',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './students-tooth.component.html',
  styleUrl: './students-tooth.component.scss',
})
export class StudentsToothComponent {
  @Input() data: any;
  @Input() index: number = 0;
  @Input() color: string = 'withe';
  @Input() all: string = '';
  @Output() toggleTooth = new EventEmitter<any>();
  @Output() setFace = new EventEmitter<any>();

  /**
   * Función invocada cuando se hace clic en un diente.
   * @param data Información de los estudiantes y sus dientes.
   * @param index Índice del estudiante actual.
   * @param faceId Identificador del diente seleccionado.
   * @param all Variable de control opcional.
   */

  // Variable para almacenar el color de la simbologia
  newSimbolColor: string = '';
  clicked(data: any, index: number, faceId: any, all: string) {
    // Se emite un evento para configurar la cara con la información del diente seleccionado.
    this.setFace.emit({faceId: data.faces[index].id, index: index, data: data, all: all,});

    console.log('data', data);
    // Se define un nuevo estado 'blue'.
    const newEstado = 'blue';

    // Se itera sobre todos los dientes.
    data.faces.forEach((face: Face) => {
      // Si el estado del diente es 'blue', se actualiza el estado de todos los dientes a 'blue'.
      if (face.estado === 'blue') {
        // Se define un nuevo estado 'blue'.
        const newEstado = 'blue';

        console.log('estado', face.estado);

        // Se itera sobre todos los dientes y se actualiza su estado a 'blue'.
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }


      if (face.estado === 'H') {
        const newSimbol = 'white';

        this.newSimbolColor = 'H';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }

      if (face.estado === 'F') {
        const newSimbol = 'white';

        this.newSimbolColor = 'F';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }

      if (face.estado === '✓') {
        const newSimbol = 'white';

        this.newSimbolColor = '✓';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }
      
      if (face.estado === '⤻') {
        const newSimbol = 'white';

        this.newSimbolColor = '⤻';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }
   
      
      
    });
  }
}
