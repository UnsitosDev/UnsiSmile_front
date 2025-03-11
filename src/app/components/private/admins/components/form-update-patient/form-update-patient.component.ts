import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-form-update-patient',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './form-update-patient.component.html',
  styleUrl: './form-update-patient.component.scss'
})
export class FormUpdatePatientComponent implements OnInit {
  patientId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.patientId = params['idPatient'];
      console.log('ID del paciente:', this.patientId);
      // Aquí puedes hacer la llamada al servicio para obtener los datos del paciente
    });
  }
}
