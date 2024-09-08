import { vitalSignRequest } from '../../../../../models/shared/patients/vitalSigns/vitalSign';

import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientService } from 'src/app/services/patient/patient.service';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { VitalSignsFormService } from 'src/app/services/history-clinics/general/general.service';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";


@Component({
  selector: 'app-history-vital-signs',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FieldComponentComponent
],
  templateUrl: './history-vital-signs.component.html',
  styleUrl: './history-vital-signs.component.scss',
})
export class HistoryVitalSignsComponent implements OnInit {
  formGroup!: FormGroup;
  vitalSigns: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private vitalSignsFields: VitalSignsFormService,

  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.vitalSigns = this.vitalSignsFields.getVitalSignsFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.vitalSigns].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  postVitalSigns(){
    this.nextTab();
  }
  

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
