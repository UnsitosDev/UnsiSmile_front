import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
  selector: 'app-dialog-upload-progress-note',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dialog-upload-progress-note.component.html',
  styleUrl: './dialog-upload-progress-note.component.scss'
})
export class DialogUploadProgressNoteComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DialogUploadProgressNoteComponent>);
  file: File | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProgressNote) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }

  sendFile() {


  }

}
