import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
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
  bucalExamFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private bucalExam: bucalExamService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.bucalExamFields = this.bucalExam.getbucalExamFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.bucalExamFields].forEach(field => {
      this.formGroup.addControl(
        field.name,
        this.fb.control(field.value || '', field.validators || [])
      );
    });
  }
  
  getFieldValue(fieldName: string) {
    return this.formGroup.get(fieldName)?.value;
  }

  onSubmit(){
    this.nextTab();
  }

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
