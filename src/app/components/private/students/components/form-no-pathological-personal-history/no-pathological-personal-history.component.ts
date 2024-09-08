import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { personalPathologicalHistoryFormService } from 'src/app/services/history-clinics/general/personalPathological.service';
import { FormField } from 'src/app/models/form-fields/form-field.interface';
import { FieldComponentComponent } from "../../../../../shared/components/field-component/field-component.component";
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-no-pathological-personal-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, FieldComponentComponent, ReactiveFormsModule],
  templateUrl: './no-pathological-personal-history.component.html',
  styleUrl: './no-pathological-personal-history.component.scss',
})
export class NoPathologicalPersonalHistoryComponent {
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
  }

  @Output() nextMatTab = new EventEmitter<number>();
  nextTab() {
    this.nextMatTab.emit(0);
  }
}
