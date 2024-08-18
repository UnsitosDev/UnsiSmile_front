import { Component } from '@angular/core';
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';


@Component({
  selector: 'app-students-dashboard',
  standalone: true,
  imports: [TablaDataComponent],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.scss'
})
export class StudentsDashboardComponent {

  constructor(){}
  columnas: string[] = [];

  title:string = 'Mouses';

  ngOnInit(): void {
  }

  // onAction(accion: Accion) {
  //   if (accion.accion == 'Editar') {
  //    this.editar(accion.fila)
  //  } else if (accion.accion == 'Eliminar') {
  //    this.eliminar(accion.fila.nombre)
  //  }
 }

//  editar(objeto:any){
//    console.log("editar", objeto)
//  }

//  eliminar(nombre:string){
//    console.log("eliminar",nombre)
//  }

