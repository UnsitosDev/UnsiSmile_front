import { AbstractControl, ValidatorFn } from '@angular/forms';

export function curpValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const curpPattern = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    const valid = curpPattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

export function genderValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return { genderRequired: true };
    }
    return null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const phonePattern = /^\d{10}$/;
    const valid = phonePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}