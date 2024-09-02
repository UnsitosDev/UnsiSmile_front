import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar ReactiveFormsModule
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-field-component',
  standalone: true,
  imports: [MatInputModule, FormsModule, AsyncPipe, MatInputModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './field-component.component.html',
  styleUrl: './field-component.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export class FieldComponentComponent {

  @Input() field: any;
  @Input() formGroup!: FormGroup;
  @Input() errors: any;
  @Input() fieldValue: any;
  @Output() setFieldValue = new EventEmitter<any>();

  typeElement: string = '';
  datePipe = inject(DatePipe);

  myControl = new FormControl('');
  filteredOptions!: Observable<{ value: string; label: string }[]>;

  ngOnInit() {
    // Inicializar el control para el autocomplete
    const control = this.formGroup.get(this.field.name);
    this.myControl = control instanceof FormControl ? control : new FormControl('');

    // Filtrar opciones basadas en el valor de entrada
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fieldValue']) {
      this.myControl.setValue(changes['fieldValue'].currentValue);
    }
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (this.field.onInputChange) {
      this.field.onInputChange.changeFunction?.(value);
    }

    this.setFieldValue.emit({ name: this.field.name, value });
  }

  onInputAutocomplete(event: Event): void {

    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (this.field.onInputChange) {
      this.field.onInputChange.changeFunction?.(value);
    }

    this.setFieldValue.emit({ field: this.field.name, value: value });

  }

  private _filter(value: string): { value: string; label: string }[] {
    const filterValue = value.toLowerCase();
    return this.field.options.filter((option: any) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChange2(event: any) {
    const selectedValue2 = event.value;

    const selectedOption = this.field?.options?.find((option: any) => option.value === selectedValue2);

    this.setFieldValue.emit({ field: this.field.name, value: selectedOption });
  }

  onValueChange(event: any) {
    // Emite el valor para todos los tipos de eventos
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }

  handleSelectChange(event: any) {
    const value = event.target ? event.target.value : event.value;
    this.setFieldValue.emit({ field: this.field.name, value: value });
  }

  onValueChangeDate(event: any) {
    const value = event.value as Date;
    this.setFieldValue.emit({ field: this.field.name, value: this.datePipe.transform(value, 'yyyy-MM-dd') });
  }

  hasLastError(fieldName: string): boolean {
    const control = this.formGroup.get(fieldName);
    if (!control) return false;

    const errors = control.errors;
    if (!errors) return false;

    // Considera cualquier error que no sea 'required' como un 'lastError'
    return Object.keys(errors).some(errorKey => errorKey !== 'required');
  }

}
