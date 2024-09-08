import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { MatButtonModule } from '@angular/material/button';
import { radiographicAnalisisService } from 'src/app/services/history-clinics/general/radiographicAnalisis.service';
@Component({
  selector: 'app-form-radiographic-analysis',
  standalone: true,
  imports: [ReactiveFormsModule,FieldComponentComponent,MatButtonModule],
  templateUrl: './form-radiographic-analysis.component.html',
  styleUrl: './form-radiographic-analysis.component.scss'
})
export class FormRadiographicAnalysisComponent {
  formGroup!: FormGroup;
  radiographicAnalysisFields : FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private radiographicAnalysis: radiographicAnalisisService,

  ) { }

  ngOnInit(): void {
    //Obtener los campos del formulario del servicio
    this.radiographicAnalysisFields = this.radiographicAnalysis.getRadiographicAnalisisFields();


    // Construcción del formulario
    this.formGroup = this.fb.group({}); // Inicializar el FormGroup
    [...this.radiographicAnalysisFields].forEach(field => {
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
