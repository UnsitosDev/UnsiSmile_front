import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { jsPDF } from 'jspdf';
import { cardPatient } from 'src/app/models/shared/patients/cardPatient';

interface ProgressNote {
  id: number;
  title: string;
  content: string;
  idProgressNote: string;
  bloodPressure: string;
  temperature: number;
  heartRate: number;
  respirationRate: number;
  oxygenSaturation: number;
  diagnosis: string;
  prognosis: string;
  treatment: string;
  indications: string;
  student: string;
  professor: string;
  files: any[];
  patient: {
    idPatient: string;
    name: string;
    birthDate: [number, number, number];
    age: number;
    origin: string;
    medicalRecordNumber: number;
    creationDate: [number, number, number];
    isMinor: boolean;
    guardian: string | null;
  };
  creationDate: string;
}

@Component({
  selector: 'app-dialog-info-progress-note',
  standalone: true,
  imports: [MatCardModule, MatIconButton, MatListModule, MatIconModule, MatDialogModule, MatDialogModule],
  templateUrl: './dialog-info-progress-note.component.html',
  styleUrl: './dialog-info-progress-note.component.scss'
})
export class DialogInfoProgressNoteComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogInfoProgressNoteComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { note: ProgressNote, patientId: string, patientData: cardPatient, medicalRecordNumber: number, progressNoteData: any }) { }

  ngOnInit(): void {
    
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

  formatBirthDate(birthDate: [number, number, number]): string {
    const [year, month, day] = birthDate; 
    return `${day}/${month}/${year}`;
  }

  formatCreationDate(creationDate: string): string {
    const date = new Date(creationDate);
    return date.toLocaleString();
  }

  generatePdf(): void {
    const doc = new jsPDF();

    // Configuración del PDF
    doc.setFont('helvetica', 'normal');

    // Definir márgenes
    const margin = 10; // Margen de 10 puntos en todos los lados
    const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
    const maxLineWidth = pageWidth - 2 * margin; // Ancho máximo de la línea

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
        { label: 'Nombre completo del paciente:', value: this.data.note.patient.name },
        { label: 'Fecha de nacimiento:', value: this.formatBirthDate(this.data.note.patient.birthDate) },
        { label: 'Edad:', value: this.data.note.patient.age?.toString() }, // Convertir número a string
        { label: 'Sexo:', value: this.data.patientData.gender },
        { label: 'Lugar de procedencia:', value: this.data.note.patient.origin },
        { label: 'Número de expediente:', value: this.data.medicalRecordNumber?.toString() }, // Convertir número a string
        { label: 'Fecha y hora de elaboración:', value: this.formatCreationDate(this.data.note.creationDate) }
      ];

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

      // Actualización del cuadro clínico (en negritas)
      doc.setFont('helvetica', 'bold'); // Cambiar a negrita
      doc.setFontSize(12); // Ajustar el tamaño de la fuente
      doc.text('Cuadro clínico', margin + 10, currentY + 10);

      // Restablecer la fuente a normal para el resto del contenido
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10); // Restaurar el tamaño de la fuente

      // Reducir el espacio entre líneas (por ejemplo, 8 puntos en lugar de 10)
      const clinicalUpdateSpacing = 8;
      const clinicalData = [
        { label: 'Presión arterial:', value: this.data.note.bloodPressure?.toString() || '' }, // Convertir a string
        { label: 'Temperatura:', value: this.data.note.temperature?.toString() || '' }, // Convertir a string
        { label: 'Frecuencia cardíaca:', value: this.data.note.heartRate?.toString() || '' }, // Convertir a string
        { label: 'Frecuencia respiratoria:', value: this.data.note.respirationRate?.toString() || '' }, // Convertir a string
        { label: 'Saturación de oxígeno:', value: this.data.note.oxygenSaturation?.toString() || '' }, // Convertir a string
        { label: 'Diagnóstico:', value: this.data.note.diagnosis || '' },
        { label: 'Pronóstico:', value: this.data.note.prognosis || '' },
        { label: 'Tratamiento:', value: this.data.note.treatment || '' },
        { label: 'Indicaciones odontológicas:', value: this.data.note.indications + ''|| '' }
      ];

      clinicalData.forEach((data, index) => {
        // Agregar el texto de la etiqueta (label)
        doc.text(data.label, margin + 10, currentY + 20 + clinicalUpdateSpacing * (index + 1));
    
        // Calcular la posición X del valor
        const labelWidth = doc.getTextWidth(data.label);
        const valueX = margin + 10 + labelWidth + 5; // Espacio entre el label y el valor
    
        // Dividir el valor en varias líneas si es necesario
        const splitText = doc.splitTextToSize(data.value, maxLineWidth - (valueX - margin));
        splitText.forEach((line: string, lineIndex: number) => { // Definir tipos explícitos
            doc.text(line, valueX, currentY + 20 + clinicalUpdateSpacing * (index + 1) + lineIndex * clinicalUpdateSpacing);
            const lineWidth = doc.getTextWidth(line);
            doc.line(
                valueX,
                currentY + 20 + clinicalUpdateSpacing * (index + 1) + lineIndex * clinicalUpdateSpacing + lineOffset,
                valueX + lineWidth,
                currentY + 20 + clinicalUpdateSpacing * (index + 1) + lineIndex * clinicalUpdateSpacing + lineOffset
            );
        });
    
        // Ajustar la posición vertical si el texto se dividió en varias líneas
        currentY += (splitText.length - 1) * clinicalUpdateSpacing;
    });

      // Firmas (en negritas)
      doc.setFont('helvetica', 'bold'); // Cambiar a negrita
      doc.setFontSize(12); // Ajustar el tamaño de la fuente
      doc.text('Firmas', margin + 10, currentY + 130);

      // Restablecer la fuente a normal para el resto del contenido
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10); // Restaurar el tamaño de la fuente

      doc.text('Nombre y firma del operador que elaboró la nota: ________________________', margin + 10, currentY + 140);
      doc.text('Firma del paciente: ________________________', margin + 10, currentY + 150);
      doc.text('Nombre y firma del profesor responsable: ________________________', margin + 10, currentY + 160);

      // Guardar el PDF
      doc.save('Nota_de_Evolucion.pdf');
    };
  }
}