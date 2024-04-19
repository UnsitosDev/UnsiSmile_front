import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Face {
  id: string;
  estado: string;
}

@Component({
  selector: 'app-students-tooth',
  standalone: true,
  imports: [
    NgClass,
    NgIf

  ],
  templateUrl: './students-tooth.component.html',
  styleUrl: './students-tooth.component.scss'
})

export class StudentsToothComponent {
  @Input() data: any;
  @Input() index: number = 0;
  @Input() color: string = "withe";
  @Output() toggleTooth = new EventEmitter<any>();
  @Output() setFace = new EventEmitter<any>();

  // clicked(data: any, index:number, faceId:any){
  //   this.setFace.emit({ faceId: data.faces[index].id, index: index, data: data });
  //   console.log('Data', data);
  //   console.log('id', data.id);
    
  //   console.log('faces id y estado:');
  //   data.faces.forEach((face: Face) => {
  //     console.log('ID:', face.id);
  //     console.log('Estado:', face.estado);
  //   });
  // }
  
  clicked(data: any, index: number, faceId: any): void {
    // Obtener el nuevo estado (en este caso, verde)
    const newEstado = 'green';
  
    // Actualizar el estado de todas las regiones del diente al nuevo estado
    data.faces.forEach((face: Face) => {
      face.estado = newEstado;
    });
  
    // Emitir un evento con los datos actualizados del diente
    this.setFace.emit({ faceId: data.faces[index].id, index: index, data: data });
  
    // Imprimir en consola los IDs y estados actualizados de todas las regiones del diente
    console.log('faces id y estado:');
    data.faces.forEach((face: Face) => {
      console.log('ID:', face.id);
      console.log('Estado:', face.estado);
    });
  }
  

}
