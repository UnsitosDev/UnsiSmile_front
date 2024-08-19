import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';  // Importa MatGridListModule
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { curpValidator, genderValidator } from 'src/app/utils/validators';

export interface Field {
  typeElement: string;
  gridSize: number;
  [key: string]: any;
}

export interface Row {
  row: Field[];
  index: number;
}

@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [NgFor, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormPatientPersonalDataComponent{
  // Datos personales
  firstNameControl = new FormControl('', [Validators.required]); // Primer Nombre
  firstSurnameControl = new FormControl('', [Validators.required]); // Apellido Paterno
  lastSurnameControl = new FormControl('', [Validators.required]); // Apellido Materno
  curpControl = new FormControl('', [Validators.required,curpValidator()]);  // curp 
  telControl = new FormControl('', [Validators.required]);  // telefono 
  birthDateControl = new FormControl('', [Validators.required]); // fecha de nacimiento
  genderControl = new FormControl('', [genderValidator()]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]); // Correo electronico

}
