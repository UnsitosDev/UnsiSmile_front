import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from '@mean/shared';
import { MatCardModule } from '@angular/material/card';

interface Group {
  idGroup: number;
  groupName: string;
}

@Component({
  selector: 'app-dialog-assign-group',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    LoadingComponent,
    MatCardModule
  ],
  templateUrl: './dialog-assign-group.component.html',
  styleUrl: './dialog-assign-group.component.scss'
})
export class DialogAssignGroupComponent implements OnInit {
  groups: Group[] = [];
  selectedGroupId: number | null = null;
  loading = false;
  professorName: string = '';
  
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);

  constructor(
    public dialogRef: MatDialogRef<DialogAssignGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeNumber: string }
  ) {}

  ngOnInit(): void {
    this.getProfessorInfo();
    this.getGroups();
  }

  getProfessorInfo(): void {
    this.loading = true;
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      url: `${UriConstants.GET_PROFESSORS}/${this.data.employeeNumber}`,
      data: {}
    }).subscribe({
      next: (response: any) => {
        this.professorName = `${response.person.firstName} ${response.person.secondName || ''} ${response.person.firstLastName} ${response.person.secondLastName || ''}`.trim();
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar la información del profesor', 'Error');
        console.error('Error al cargar la información del profesor:', error);
        this.loading = false;
      }
    });
  }

  getGroups(): void {
    this.loading = true;
    this.apiService.getService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      url: UriConstants.GET_GROUPS,
      data: {}
    }).subscribe({
      next: (response: any) => {
        this.groups = response;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los grupos', 'Error');
        console.error('Error al cargar los grupos:', error);
        this.loading = false;
      }
    });
  }

  assignGroup(): void {
    if (!this.selectedGroupId) {
      this.toastr.warning('Por favor, seleccione un grupo', 'Advertencia');
      return;
    }

    this.loading = true;
    const requestData = {
      idProfessorGroup: 0,
      employeNumber: this.data.employeeNumber,
      idGroup: this.selectedGroupId
    };

    this.apiService.postService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      url: `${UriConstants.HOST}/professors/professor-groups`,
      data: requestData
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Error al asignar el grupo', 'Error');
        console.error('Error al asignar el grupo:', error);
        this.dialogRef.close(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
