import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { HttpHeaders } from '@angular/common/http';

export interface ProfessorSummary {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  employeeNumber: string;
  curp: string;
  career: string;
  status: string;
}

@Component({
  selector: 'app-card-professor-data',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card-professor-data.component.html',
  styleUrl: './card-professor-data.component.scss'
})
export class CardProfessorDataComponent implements OnInit {
  @Input() professorId!: string;
  @Input() data!: ProfessorSummary;
  private professorService = inject(ApiService);

  ngOnInit(): void {
    this.getInfoProfessor();
  }

  getInfoProfessor() {
    if (this.professorId !== undefined) {
      this.professorService.getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_PROFESSORS}/${this.professorId}`,
        data: {},
      }).subscribe({
        next: (response: any) => {
          this.data = this.mapToProfessorSummary(response);
        },
        error: (error) => {
          console.error('Error fetching professor data:', error);
        },
      });
    }
  }

  private mapToProfessorSummary(response: any): ProfessorSummary {
    const person = response.person;
    const birthDate = person.birthDate ? new Date(person.birthDate).toLocaleDateString() : 'No disponible';
    
    return {
      fullName: `${person.firstName} ${person.secondName || ''} ${person.firstLastName} ${person.secondLastName || ''}`.trim(),
      gender: person.gender?.gender || 'No especificado',
      birthDate: birthDate,
      phone: person.phone || 'No disponible',
      email: person.email || 'No disponible',
      employeeNumber: response.employeeNumber || 'No disponible',
      curp: person.curp || 'No disponible',
      career: response.career?.career || 'Odontología',
      status: response.user?.status ? 'Activo' : 'Inactivo'
    };
  }
}
