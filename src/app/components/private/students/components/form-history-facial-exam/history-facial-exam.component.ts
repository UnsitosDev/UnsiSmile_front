import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveFormsModule } from '@angular/forms';
import { PatientService } from 'src/app/services/patient/patient.service';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { faciealExamService } from 'src/app/services/history-clinics/general/facialExam.service';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";


interface FacialFrontData {
  idFacialFront: number;
  facialFront: string;
}

@Component({
  selector: 'app-history-facial-exam',
  standalone: true,
  imports: [
    FieldComponentComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule
],
  templateUrl: './history-facial-exam.component.html',
  styleUrl: './history-facial-exam.component.scss',
})
export class HistoryFacialExamComponent implements OnInit {
  private patientService = inject(PatientService);
  formGroup!: FormGroup;
  faciealExam: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private faciealExamFields: faciealExamService,

  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.faciealExam = this.faciealExamFields.getfacialExamFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.faciealExam].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  postFacialExam(){
    this.nextTab();
    this.emitNextTabEvent();
  }

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  emitNextTabEvent() {
      this.nextTabEventEmitted.emit(false);
  }
  
  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
