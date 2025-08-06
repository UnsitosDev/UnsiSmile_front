import { Component, inject } from '@angular/core';
import { ApiService } from "src/app/shared/services";
import { HttpHeaders } from "@angular/common/http";
import { UriConstants } from "@mean/utils";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { PaginatedData, TreatmentDetailResponse, Treatments } from 'src/app/shared/models';
import {MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-dialog-reports-treatments',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCard, MatCardTitle, MatIcon, MatFormFieldModule, MatSelectModule],
  templateUrl: './dialog-reports-treatments.component.html',
  styleUrl: './dialog-reports-treatments.component.scss'
})
export class DialogReportsTreatmentsComponent {
  public dialogRef = inject(MatDialogRef<DialogReportsTreatmentsComponent>);
  private readonly apiService = inject(ApiService);               // Servicio para hacer peticiones a la API
  private readonly data = inject(MAT_DIALOG_DATA);                // Datos inyectados desde el componente padre
  private readonly toastr = inject(ToastrService);                // Servicio para mostrar notificaciones toast
  private idStudent!: string;                                     // Almacena la matrícula del estudiante
  public treatments: PaginatedData<TreatmentDetailResponse> | null = null;     // Almacena la lista paginada de tratamientos
  public treatmentData: Treatments[] = [];
  public selectedIdTreatment = 'none';

  ngOnInit() {
    this.idStudent = this.data.idStudent;                        // Asigna el ID del estudiante desde los datos inyectados
    this.fetchTreatments();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  // Obtiene los tratamientos asociados al estudiante desde la API
  public fetchTreatmentStudent() {
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_PATIENTS_FOR_REPORTS}/${this.idStudent}?idTreatment=${this.selectedIdTreatment}`,
      data: {},
    }).subscribe({
      next: (response) => {
        this.treatments = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Genera y descarga el PDF del reporte de un tratamiento específico
  public getReportTreatment(treatment: TreatmentDetailResponse) {
    const idTreatmentDetail = treatment.idTreatmentDetail;

    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_GENERATE_REPORT_TREATMENT}/${this.idStudent}?idTreatment=${this.selectedIdTreatment}`,  // URL con parámetros
      data: {},
      responseType: 'blob'                                      // Espera un blob (archivo binario) como respuesta
    }).subscribe({
      next: (response: Blob) => {
        // Prepara el blob con el tipo MIME correcto para PDF
        const blob = new Blob([response], {
          type: 'application/pdf'                               // Especifica que es un documento PDF
        });

        // Crea elemento <a> temporal para la descarga
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);           // Genera URL para el blob
        link.href = url;                                        // Asigna la URL al enlace

        // Genera nombre descriptivo para el archivo
        link.download = `Reporte_${treatment.treatment.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

        // Simula click para iniciar descarga
        document.body.appendChild(link);                        // Añade el enlace al DOM
        link.click();                                           // Dispara el evento de click

        // Limpieza de recursos
        document.body.removeChild(link);                        // Elimina el enlace del DOM
        window.URL.revokeObjectURL(url);                        // Libera la URL del blob
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al descargar el reporte', 'Error');
      }
    });
  }

  public fetchTreatments(){
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      url: `${UriConstants.GET_TREATMENTS}`,
      data: {},
    }).subscribe({
      next: (response: Treatments[]) => {
        this.treatmentData = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
