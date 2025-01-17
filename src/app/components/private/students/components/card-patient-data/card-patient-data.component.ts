import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

export interface PatientSummary {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
  email: string;
  admissionDate: string;
  curp: string
}

export interface cardGuardian {
  firstName: string,
  lastName: string,
  phone: string,
  email: string
}
@Component({
  selector: 'app-card-patient-data',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './card-patient-data.component.html',
  styleUrl: './card-patient-data.component.scss'
})
export class CardPatientDataComponent{
  @Input() data!: PatientSummary;
  @Input() guardianData: cardGuardian | null = null;
}
