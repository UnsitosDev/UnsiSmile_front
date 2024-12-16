import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
@Component({
  selector: 'app-admin-upload-students',
  standalone: true,
  imports: [MatIconModule, MatDividerModule, MatButtonModule, MatCardTitle],
  templateUrl: './admin-upload-students.component.html',
  styleUrl: './admin-upload-students.component.scss'
})
export class AdminUploadStudentsComponent {
  fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = null;
    }
  }
}
