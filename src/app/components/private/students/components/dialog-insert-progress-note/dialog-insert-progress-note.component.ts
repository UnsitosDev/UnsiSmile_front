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
  constructor(@Inject(MAT_DIALOG_DATA) public data: { patientId: string }) {}

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
    if (this.formGroup.valid) {
      this.apiService
      .postService({
        headers: new HttpHeaders({}),
        url: `${UriConstants.POST_EVOLUTION_NOTE}`,
        data: formData,
      })
      .subscribe({
        next: (response) => {
          this.closeDialog();
        },
        error: (error) => {
          this.toastr.warning(error);
        },
      });
    } else {
      this.markFormGroupTouched(this.formGroup);
      this.toastr.warning(Messages.WARNING_PROGRESS_NOTE, 'Advertencia');
    }
  }

  generatePdf(formData: any): void {
    const doc = new jsPDF();

    // Configuración del PDF
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Título del PDF
    doc.setFontSize(16);
    doc.text('Nota de Evolución', 10, 10);

    // Datos del paciente
    doc.setFontSize(12);
    doc.text(`Nombre completo del paciente: ${formData.patientName || 'N/A'}`, 10, 20);
    doc.text(`Fecha de nacimiento: ${formData.birthDate || 'N/A'}`, 10, 30);
    doc.text(`Edad: ${formData.age || 'N/A'}`, 10, 40);
    doc.text(`Sexo: ${formData.gender || 'N/A'}`, 10, 50);
    doc.text(`Lugar de procedencia: ${formData.origin || 'N/A'}`, 10, 60);
    doc.text(`Número de expediente: ${formData.recordNumber || 'N/A'}`, 10, 70);
    doc.text(`Fecha y hora de elaboración: ${formData.creationDate || 'N/A'}`, 10, 80);

    // Actualización del cuadro clínico
    doc.setFontSize(14);
    doc.text('Actualización del cuadro clínico', 10, 90);
    doc.setFontSize(12);
    doc.text(`Presión arterial: ${formData.bloodPressure || 'N/A'}`, 10, 100);
    doc.text(`Temperatura: ${formData.temperature || 'N/A'}`, 10, 110);
    doc.text(`Frecuencia cardíaca: ${formData.heartRate || 'N/A'}`, 10, 120);
    doc.text(`Frecuencia respiratoria: ${formData.respiratoryRate || 'N/A'}`, 10, 130);
    doc.text(`Saturación de oxígeno: ${formData.oxygenSaturation || 'N/A'}`, 10, 140);
    doc.text(`Diagnóstico: ${formData.diagnosis || 'N/A'}`, 10, 150);
    doc.text(`Pronóstico: ${formData.prognosis || 'N/A'}`, 10, 160);
    doc.text(`Tratamiento: ${formData.treatment || 'N/A'}`, 10, 170);
    doc.text(`Indicaciones odontológicas: ${formData.dentalInstructions || 'N/A'}`, 10, 180);

    // Firmas
    doc.setFontSize(14);
    doc.text('Firmas', 10, 190);
    doc.setFontSize(12);
    doc.text('Nombre y firma del operador que elaboró la nota: ________________________', 10, 200);
    doc.text('Firma del paciente: ________________________', 10, 210);
    doc.text('Nombre y firma del profesor responsable: ________________________', 10, 220);

    // Guardar el PDF
    doc.save('Nota_de_Evolucion.pdf');
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

}
