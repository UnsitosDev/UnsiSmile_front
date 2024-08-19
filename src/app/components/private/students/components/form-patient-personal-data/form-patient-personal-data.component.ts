import { Component, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { curpValidator, genderValidator } from 'src/app/utils/validators';
import { AlertModel } from '@mean/models';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-form-patient-personal-data',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatSelectModule, AlertComponent],
  templateUrl: './form-patient-personal-data.component.html',
  styleUrl: './form-patient-personal-data.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormPatientPersonalDataComponent {
  alertMessage: string = '';
  alertSeverity: string = AlertModel.AlertSeverity.ERROR;
  showAlert: boolean = false;

  formGroup: FormGroup;
  constructor() {
    this.formGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      firstSurname: new FormControl('', [Validators.required]),
      lastSurname: new FormControl('', [Validators.required]),
      curp: new FormControl('', [Validators.required, curpValidator()]),
      tel: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      gender: new FormControl('', [genderValidator()]),
      emailForm: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const formData = {
        personalData: {
          name: this.formGroup.get('firstName')?.value,
          surname: this.formGroup.get('firstSurname')?.value,
          lastName: this.formGroup.get('lastSurname')?.value,
          curp: this.formGroup.get('curp')?.value,
          phone: this.formGroup.get('tel')?.value,
          birthDate: this.formGroup.get('birthDate')?.value,
          gender: this.formGroup.get('gender')?.value,
          email: this.formGroup.get('emailForm')?.value
        }
      };

      console.log('Data', formData);

    } else {
      this.alertMessage = 'Por favor, completa todos los campos correctamente.';
      this.showAlert = true;
    }
  }
}
