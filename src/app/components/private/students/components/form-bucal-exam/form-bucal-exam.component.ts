import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField, formSectionFields } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { bucalExamService } from 'src/app/services/history-clinics/general/bucalExamFields.service';

@Component({
  selector: 'app-form-bucal-exam',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-bucal-exam.component.html',
  styleUrl: './form-bucal-exam.component.scss'
})
export class FormBucalExamComponent {
  formGroup!: FormGroup;
  bucalExamFields : formSectionFields[] = [];

  constructor(
    private fb: FormBuilder,
    private bucalExam: bucalExamService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    // this.bucalExamFields = this.bucalExam.getOralExamFields();


    // // Construcción del formulario
    //  this.formGroup = this.fb.group({});
    //  this.bucalExamFields.forEach(tab => {
    //   if (tab.seccion) {  // Verificamos que `seccion` no es null
    //     tab.seccion.forEach(sectionField => {
    //       this.formGroup.addControl(
    //         sectionField.name,
    //         this.fb.control(sectionField.value || '', sectionField.validators || [])
    //       );
    //     });
    //   }
    // });
    
  }
  
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onSubmit(){
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
