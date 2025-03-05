import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { ProgressNotesService } from 'src/app/services/form-progress-notes.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { ApiService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';
import { ProgressNotesComponent } from '../progress-notes/progress-notes.component';
import { jsPDF } from 'jspdf';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { PaginatedData } from 'src/app/models/shared/pagination/pagination';

@Component({
  selector: 'app-dialog-insert-progress-note',
  standalone: true,
  imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FieldComponentComponent, MatDividerModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dialog-insert-progress-note.component.html',
  styleUrl: './dialog-insert-progress-note.component.scss'
})
export class DialogInsertProgressNoteComponent implements OnInit {
  formGroup!: FormGroup;
  progressNotesForm: any[] = [];
  apiService = inject(ApiService);
  private formProgressNotes = inject(ProgressNotesService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DialogInsertProgressNoteComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { patientId: string, patientData: cardPatient, medicalRecordNumber: number, progressNoteData: any }) { }

  ngOnInit(): void {
    // Obtener los campos del formulario desde el servicio
    this.progressNotesForm = this.formProgressNotes.getFormProgressNotes();

    // Inicializar el FormGroup y agregar controles dinámicamente
    this.formGroup = this.fb.group({});
    this.progressNotesForm.forEach((field) => {
      this.formGroup.addControl(
        field.name,
        this.fb.control('', field.validators)
      );
    });

    console.log('Datos del paciente desde el dialog:', this.data.patientData);
    console.log('Datos de la nota de evolución:', this.data.progressNoteData);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onInsert(): void {
    const formValues = this.formGroup.value;

    const formData = {
      ...formValues,
      patientId: this.data.patientId,
    };

    this.generatePdf(formData);

    console.log('formData', formData);
    // if (this.formGroup.valid) {
    //   this.apiService
    //     .postService({
    //       headers: new HttpHeaders({}),
    //       url: `${UriConstants.POST_EVOLUTION_NOTE}`,
    //       data: formData,
    //     })
    //     .subscribe({
    //       next: (response) => {
    //         this.closeDialog();
    //       },
    //       error: (error) => {
    //         this.toastr.warning(error);
    //       },
    //     });
    // } else {
    //   this.markFormGroupTouched(this.formGroup);
    //   this.toastr.warning(Messages.WARNING_PROGRESS_NOTE, 'Advertencia');
    // }
  }

  generatePdf(formData: any): void {
    const doc = new jsPDF();

    // Configuración del PDF
    doc.setFont('helvetica', 'normal');

    // Definir márgenes
    const margin = 10; // Margen de 10 puntos en todos los lados
    const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
    const maxLineWidth = pageWidth - 2 * margin; // Ancho máximo de la línea

    // Dibujar un borde alrededor del contenido

    // Agregar la imagen al encabezado
    const img = new Image();
    img.src = 'assets/unsis_logo.png'; // Ruta de la imagen
    img.onload = () => {
      const imgWidth = 30; // Ancho de la imagen
      const imgHeight = (img.height * imgWidth) / img.width; // Altura proporcional
      doc.addImage(img, 'PNG', margin + 10, margin + 10, imgWidth, imgHeight); // Posición (x, y) y tamaño

      // Texto del encabezado
      const headerText = [
        'UNIVERSIDAD DE LA SIERRA SUR',
        'Licenciatura en Odontología',
        'Clinica de Odontología',
        'NOTA DE EVOLUCIÓN'
      ];

      // Configuración del texto
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Color negro

      // Posición vertical inicial
      const textY = margin + 20;

      // Agregar cada línea del texto centrado
      headerText.forEach((line, index) => {
        if (index === headerText.length - 1) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold'); // Última línea en negritas
        }

        // Calcular el ancho del texto
        const textWidth = doc.getTextWidth(line);
        const textX = (pageWidth - textWidth) / 2; // Centrar el texto

        // Agregar el texto al PDF
        doc.text(line, textX, textY + (index * 5)); // Espaciado de 5 unidades entre líneas
      });

      // Restablecer la fuente para el resto del contenido
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Datos del paciente
      const patientData = [
        { label: 'Nombre completo del paciente:', value: this.data.patientData.fullName },
        { label: 'Fecha de nacimiento:', value: this.data.patientData.birthDate },
        { label: 'Edad:', value: this.calculateAge(this.data.patientData.birthDate).toString() || 'N/A' },
        { label: 'Sexo:', value: this.data.patientData.gender },
        { label: 'Lugar de procedencia:', value: this.data.patientData.address },
        { label: 'Número de expediente:', value: this.data.medicalRecordNumber.toString() }, // Convertir número a string
        { label: 'Fecha y hora de elaboración:', value: formData.creationDate || 'N/A' }
      ];
      
      console.log('Datos del paciente para el PDF:', patientData);

      // Posición inicial para los datos del paciente
      let currentX = margin + 10; // Margen izquierdo
      let currentY = margin + 60; // Posición vertical inicial
      const lineHeight = 7; // Interlineado entre los campos
      const lineOffset = 1; // Espacio entre el valor y la línea

      // Organizar los datos en líneas
      patientData.forEach((data) => {
        const labelWidth = doc.getTextWidth(data.label); // Ancho del texto de la pregunta
        const valueWidth = doc.getTextWidth(data.value); // Ancho del valor

        // Verificar si el texto cabe en la línea actual
        if (currentX + labelWidth + valueWidth + 10 > maxLineWidth) {
          // Pasar a la siguiente línea
          currentX = margin + 10; // Reiniciar la posición horizontal
          currentY += lineHeight; // Mover hacia abajo
        }

        // Agregar el texto de la pregunta al PDF
        doc.text(data.label, currentX, currentY);

        // Agregar el valor al PDF
        const valueX = currentX + labelWidth + 5; // Espacio entre la pregunta y el valor
        doc.text(data.value, valueX, currentY);

        // Dibujar una línea debajo del valor
        doc.line(valueX, currentY + lineOffset, valueX + valueWidth, currentY + lineOffset);

        // Actualizar la posición horizontal para el siguiente texto
        currentX += labelWidth + valueWidth + 15; // Espacio entre preguntas
      });

      // Actualización del cuadro clínico
      doc.setFontSize(10);
      doc.text('Actualización del cuadro clínico', margin + 10, currentY + 10);

      // Reducir el espacio entre líneas (por ejemplo, 8 puntos en lugar de 10)
      const clinicalUpdateSpacing = 8; // Espacio entre líneas
      doc.setFontSize(10);
      doc.text(`Presión arterial: ${formData.bloodPressure || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 1);
      doc.text(`Temperatura: ${formData.temperature || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 2);
      doc.text(`Frecuencia cardíaca: ${formData.heartRate || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 3);
      doc.text(`Frecuencia respiratoria: ${formData.respiratoryRate || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 4);
      doc.text(`Saturación de oxígeno: ${formData.oxygenSaturation || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 5);
      doc.text(`Diagnóstico: ${formData.diagnosis || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 6);
      doc.text(`Pronóstico: ${formData.prognosis || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 7);
      doc.text(`Tratamiento: ${formData.treatment || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 8);
      doc.text(`Indicaciones odontológicas: ${formData.dentalInstructions || 'N/A'}`, margin + 10, currentY + 20 + clinicalUpdateSpacing * 9);
      // Firmas
      doc.setFontSize(10);
      doc.text('Firmas', margin + 10, currentY + 130);
      doc.setFontSize(10);
      doc.text('Nombre y firma del operador que elaboró la nota: ________________________', margin + 10, currentY + 140);
      doc.text('Firma del paciente: ________________________', margin + 10, currentY + 150);
      doc.text('Nombre y firma del profesor responsable: ________________________', margin + 10, currentY + 160);

      // Guardar el PDF
      doc.save('Nota_de_Evolucion.pdf');
    };
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
  
    // Ajustar la edad si aún no ha pasado el mes de cumpleaños
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
  
    return age;
  }
}
