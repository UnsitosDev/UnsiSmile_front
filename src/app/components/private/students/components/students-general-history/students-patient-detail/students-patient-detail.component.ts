import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';
import { patientResponse } from 'src/app/models/shared/patients/patient/patient';
import { MatButton } from '@angular/material/button';
import { MatTabGroup } from '@angular/material/tabs';
import { inputClass, labelClass } from 'src/app/utils/inputs';

@Component({
  selector: 'app-students-patient-detail',
  standalone: true,
  imports: [MatButton],
  templateUrl: './students-patient-detail.component.html',
  styleUrl: './students-patient-detail.component.scss',
})
export class StudentsPatientDetailComponent implements OnInit {
  @Input() idPatient: number = 0;
  public patient!: patientResponse;
  inputClass = inputClass;
  labelClass = labelClass;
  private patientService = inject(ApiService<patientResponse, {}>);

  ngOnInit() {
    this.fetchPatientData();
  }

  year?: number;
  month?: number;
  day?: number;

  fetchPatientData() {
    this.patientService
      .getService({
        url: `${UriConstants.GET_PATIENTS + '/' + this.idPatient}`,
      })
      .subscribe({
        next: (data) => {
          this.patient = data;
          // Extraer year, month y day del objeto Date
          const birthDate = new Date(this.patient.person.birthDate);
          const year = birthDate.getFullYear();
          const month = birthDate.getMonth() + 1; // getMonth() devuelve el mes (0-11), sumamos 1 para obtener el mes (1-12)
          const day = birthDate.getDate();
          // Asignar los valores a las propiedades
          this.year = year;
          this.month = month;
          this.day = day;
        },
        error: (error) => {},
      });
  }

  id: any;

  constructor(private tabGroup: MatTabGroup) {}

  @Output() eventoEmitido = new EventEmitter<boolean>();
  pageNumber: number = 1;
  emitirEvento() {
    this.eventoEmitido.emit(false);
    console.log(false);
  }
  @Output() cambiarTab = new EventEmitter<number>();
  irSiguienteTab() {
    this.cambiarTab.emit(0);
  }

  nextPage() {
    this.emitirEvento();
    this.irSiguienteTab();
  }
}
