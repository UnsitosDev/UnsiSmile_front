import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

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

  

  clicked(data: any, index:number, faceId:any){
    this.setFace.emit({ faceId: data.faces[index].id, index: index, data: data });
    const newEstado = 'green';
    

    console.log('Data', data);
    console.log('id', data.id);    
    console.log('faces id y estado:');
    data.faces.forEach((face: Face) => {
      console.log('ID:', face.id);
      console.log('Estado:', face.estado);
    });
    this.handleAction;
  }
   // Método para manejar los datos emitidos por StudentsToolbarComponent
   handleAction(event: any): void {
    console.log('Datos recibidos:', event);
    // Aquí puedes realizar cualquier otra acción con los datos recibidos
  }
  
  // clicked(data: any, index: number, faceId: any): void {
  //   const newEstado = 'green';
  
  //   data.faces.forEach((face: Face) => {
  //     face.estado = newEstado;
  //   });
  
  //   this.setFace.emit({ faceId: data.faces[index].id, index: index, data: data });
  
  //   console.log('faces id y estado:');
  //   data.faces.forEach((face: Face) => {
  //     console.log('ID:', face.id);
  //     console.log('Estado:', face.estado);
  //   });
  // }
  
  

}
