import { Component } from '@angular/core';
import { TablaDataComponent } from 'src/app/components/tabla-data/tabla-data.component';
import { IKeyboard } from 'src/app/models/tabla/keyboard';
import { getEntityPropiedades, Accion } from 'src/app/models/tabla/tabla-columna';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [TablaDataComponent],
  templateUrl: './students-patients.component.html',
  styleUrl: './students-patients.component.scss'
})
export class StudentsPatientsComponent {

  
  constructor(private productService:ProductService){}

  keyboardList:IKeyboard[]=[];
  columnas: string[] = [];

  title:string = 'Keyboards';

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('keyboard');

    this.productService.obtenerKeyboardList().subscribe(data=>{
      this.keyboardList = data;

      console.log(this.keyboardList);
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
