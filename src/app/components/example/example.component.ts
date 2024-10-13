import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NgIf, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnChanges, OnInit {

  myControl = new FormControl('');

  // Definimos las validaciones predeterminadas en un JSON
  validations = {
    required: true,
    minLength: 3,
    maxLength: 5,
    pattern: '^[a-zA-Z]+$' // Solo letras
  };

  ngOnInit(): void {
    // Aplicar las validaciones predeterminadas al inicializar el componente
    this.applyValidations(this.validations);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificar si las validaciones han cambiado y aplicar las nuevas validaciones
    if (changes['validations']) {
      this.applyValidations(changes['validations'].currentValue);
    }
  }

  private applyValidations(validations: { [key: string]: any }): void {
    // Definimos todas las validaciones en un arreglo y filtramos nulos
    let validators: ValidatorFn[] = [
      validations['required'] ? Validators.required : null,
      validations['minLength'] ? Validators.minLength(validations['minLength']) : null,
      validations['maxLength'] ? Validators.maxLength(validations['maxLength']) : null,
      validations['pattern'] ? Validators.pattern(validations['pattern']) : null
    ].filter((v): v is ValidatorFn => v !== null); // Filtrar las validaciones nulas

    // Asignar las validaciones al FormControl
    this.myControl.setValidators(validators);
    this.myControl.updateValueAndValidity(); // Actualiza el estado del control
  }



}