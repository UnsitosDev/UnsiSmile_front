import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../../../services/api.service';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UriConstants } from '@mean/utils';
import { closedQuestionPathologicalAntecedentsRequest } from '../../../../../models/models-students/closedQuestionPathologicalAntecedents/closedQuestionPathologicalAntecedents';
import { openQuestionPathologicalAntecedentsRequest } from '../../../../../models/models-students/openQuestionPathologicalAntecedents/openQuestionPathologicalAntecedents';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { personalPathologicalHistoryFormService } from 'src/app/services/history-clinics/general/personalPathological.service';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pathological-personal-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, FieldComponentComponent, ReactiveFormsModule],
  templateUrl: './pathological-personal-history.component.html',
  styleUrl: './pathological-personal-history.component.scss',
})
export class PathologicalPersonalHistoryComponent implements OnInit {

  formGroup!: FormGroup;
  noPathologicalPersonData: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private fields: personalPathologicalHistoryFormService,

  ) { }

  ngOnInit(): void {
    // Obtener los campos del formulario del servicio
    this.noPathologicalPersonData = this.fields.getpathologicalHistoryFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.noPathologicalPersonData].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  sendData() {
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

  currentTabIndex: number = 0; // Índice del tab actual
  @Output() previousMatTab = new EventEmitter<number>();
  previousTab() {
      this.currentTabIndex = Math.max(this.currentTabIndex - 1, 0); // Decrementa el índice, asegurando que no sea menor que 0
      this.previousMatTab.emit(this.currentTabIndex); // Emite el índice del tab anterior
  }
}
