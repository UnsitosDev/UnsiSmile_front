import { Component, OnInit, inject } from '@angular/core';
import { TablaDataComponent } from 'src/app/shared/tabla-data/tabla-data.component';
import { IKeyboard } from 'src/app/models/tabla/keyboard';
import {
  getEntityPropiedades,
  Accion,
} from 'src/app/models/tabla/tabla-columna';
import { ProductService } from 'src/app/services/product.service';
import { Ipatients, patientsResponse } from 'src/app/models/tabla/patients';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { StudentsGeneralHistoryComponent } from '../students-general-history/students-general-history.component';
import { ApiService } from '@mean/services';
import { patientRequest } from 'src/app/models/shared/patients/patient/patient';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-students-patients',
  standalone: true,
  imports: [TablaDataComponent, MatButtonModule, RouterLink],
  templateUrl: './students-patients.component.html',
  styleUrl: './students-patients.component.scss',
})
export class StudentsPatientsComponent implements OnInit {

  keyboardList: Ipatients[] = [];
  columnas: string[] = [];
  title: string = 'Pacientes';
  private apiService = inject(ApiService<patientRequest>)


  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.columnas = getEntityPropiedades('patients');

    this.productService.obtenerPacientes().subscribe((data) => {
      this.keyboardList = data;
    });
    this.getPacientes();
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
    this.router.navigate(['/students', 'historyClinic']);

  }

  eliminar(nombre: string) {
    console.log('eliminar', nombre);
  }

  mostrarAlerta() {
    alert('¡Haz clic en un icono!');
  }


  pacientesData: patientRequest[] = [];
  getPacientes() {
    this.apiService
      .getListService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PATIENTS}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.pacientesData = response.response;
          console.log('Respuesta del servidor:', this.pacientesData);


        },
        error: (error) => {
          console.error('Error en la autenticación:', error);
        },
      });
  }

}
