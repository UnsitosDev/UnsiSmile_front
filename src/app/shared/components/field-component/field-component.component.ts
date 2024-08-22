import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar ReactiveFormsModule

@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './field-component.component.html',
  styleUrl: './field-component.component.scss'
})
export class FieldComponentComponent {
  @Input() field: any;
  @Input() formGroup!: FormGroup;
  @Input() errors: any;
  @Output() setFieldValue = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<string>();

  typeElement: string = '';

  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectionChange.emit(value);
  }

  onValueChange(event: any) {
    // Verifica si el evento es de un input o de un select
    const value = event.target ? event.target.value : event.value; 
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }
}
