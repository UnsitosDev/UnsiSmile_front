import { Component, inject, Inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';

// Define la interfaz para el objeto 'ProgressNote'
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
  imports: [MatCardModule, MatIconButton, MatListModule, MatIconModule, MatDialogModule],
  templateUrl: './dialog-info-progress-note.component.html',
  styleUrl: './dialog-info-progress-note.component.scss'
})
export class DialogInfoProgressNoteComponent {
  private dialogRef = inject(MatDialogRef<DialogInfoProgressNoteComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProgressNote) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  formatBirthDate(birthDate: [number, number, number]): string {
    const [year, month, day] = birthDate;
    return `${day}/${month}/${year}`;
  }

  formatCreationDate(creationDate: string): string {
    const date = new Date(creationDate);
    return date.toLocaleString(); // Formato localizado
  }
}
