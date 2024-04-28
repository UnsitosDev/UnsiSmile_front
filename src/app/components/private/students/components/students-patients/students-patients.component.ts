import { Component } from '@angular/core';
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';
import { IKeyboard } from 'src/app/models/tabla/keyboard';
import {
  getEntityPropiedades,
  Accion,
} from 'src/app/models/tabla/tabla-columna';
import { ProductService } from 'src/app/services/product.service';
import { Ipatients } from 'src/app/models/tabla/patients';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StudentsGeneralHistoryComponent } from '../students-general-history/students-general-history.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './students-patients.component.html',
  styleUrl: './students-patients.component.scss',
})
export class StudentsPatientsComponent {

  keyboardList: Ipatients[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('patients');

    this.productService.obtenerPacientes().subscribe((data) => {
      this.keyboardList = data;
    });
  }

  openDialog(objeto: any) {
    this.dialog.open(StudentsGeneralHistoryComponent, {
      data: objeto
    });
  }

  onAction(accion: Accion) {
    if (accion.accion == 'Editar') {
      this.editar(accion.fila);
    } else if (accion.accion == 'Eliminar') {
      this.eliminar(accion.fila.nombre);
    } else if (accion.accion == 'MostrarAlerta') {
      this.mostrarAlerta();
    }
  }

  editar(objeto: any) {
    console.log('editar', objeto);
    this.openDialog(objeto);
  }

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }
}
