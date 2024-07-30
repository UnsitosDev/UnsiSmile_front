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

  /**
   * Función invocada cuando se hace clic en un diente.
   * @param data Información de los estudiantes y sus dientes.
   * @param index Índice del estudiante actual.
   * @param faceId Identificador del diente seleccionado.
   * @param all Variable de control opcional.
   */

  // Variable para almacenar el color de la simbologia
  newSimbolColor: string = '';
  line: boolean = false;
  clicked(data: any, index: number, faceId: any, all: string, idCondition: number) {
    // Se emite un evento para configurar la cara con la información del diente seleccionado.
    this.setFace.emit({faceId: data.faces[index].id, index: index, data: data, all: all, idCondition: idCondition });

    console.log('data', data);
    console.log('option selected: ' , idCondition);

    // Se itera sobre todos los dientes.
    data.faces.forEach((face: Face) => {

      // Funcion borrador
      if (face.estado === '◻︎') {
        const newSimbol = 'white';
        this.newSimbolColor = '';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
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
   
      if (face.estado === '──') {
        const newSimbol = 'white';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
        this.line = true;
      }

      if (face.estado === 'E/C') {
        const newSimbol = 'blue';
        this.newSimbolColor = 'E/C';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }

      if (face.estado === 'E/C') {
        const newSimbol = 'blue';
        this.newSimbolColor = 'E/C';
        data.faces.forEach((face:Face) => {
          face.estado = newSimbol;
        });
      }



      if (face.estado === 'blue') {
        const newEstado = 'blue';
        console.log('estado', face.estado);
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }  


      if (face.estado === 'E/B') {
        const newEstado = 'blue';
        this.newSimbolColor = 'E/B'
        console.log('estado', face.estado);
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }  
      if (face.estado === '───') {
        const newEstado = 'blue';
        this.newSimbolColor = '───'
        console.log('estado', face.estado);
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }  
      
      if (face.estado === 'pr') {
        const newEstado = 'white';
        this.newSimbolColor = '───'
        console.log('estado', face.estado);
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }  

      if (face.estado === '△') {
        const newEstado = 'white';
        this.newSimbolColor = '△'
        console.log('estado', face.estado);
        data.faces.forEach((face: Face) => {
          face.estado = newEstado;
        });
      }  
      
    });
  }
}
