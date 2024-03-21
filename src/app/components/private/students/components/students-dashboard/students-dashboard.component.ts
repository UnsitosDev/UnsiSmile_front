import { Component } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';
import { IMouse } from 'src/app/models/tabla/mouse';
import { getEntityPropiedades, Accion } from 'src/app/models/tabla/tabla-columna';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-students-dashboard',
  standalone: true,
  imports: [TablaDataComponent],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.scss'
})
export class StudentsDashboardComponent {

  constructor(private productService:ProductService){}
  columnas: string[] = [];
  mouseList:IMouse[] =[];

  title:string = 'Mouses';

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('mouse');

    this.productService.obtenerMouseList().subscribe(data=>{
      this.mouseList = data;

      console.log(this.mouseList);
    })
  }

  onAction(accion: Accion) {
    if (accion.accion == 'Editar') {
     this.editar(accion.fila)
   } else if (accion.accion == 'Eliminar') {
     this.eliminar(accion.fila.nombre)
   }
 }

 editar(objeto:any){
   console.log("editar", objeto)
 }

 eliminar(nombre:string){
   console.log("eliminar",nombre)
 }

}
