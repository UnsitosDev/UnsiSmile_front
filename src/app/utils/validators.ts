import { AbstractControl, ValidatorFn } from '@angular/forms';

export function curpValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const curpPattern = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    const valid = curpPattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}



// Validador de presión arterial
export function bloodPressureValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const bloodPressurePattern = /^\d{2,3}\/\d{2,3}$/;
    const valid = bloodPressurePattern.test(control.value);
    
    return valid ? null : { lastError: { value: control.value } }; // Manejo de errores unificado
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

export function addressesNumber(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; 
    }
    const phonePattern = /^\d{1,8}$/; 
    const valid = phonePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailPattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const inputDate = new Date(control.value);

    // Convertir ambas fechas a medianoche UTC para comparación consistente
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const inputUtc = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    if (inputUtc > todayUtc) {
      return { futureDate: true };
    }

    return null;
  };
}

export function employeeNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null;
    
    const employeePattern = /^E\d{5}$/;
    const valid = employeePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

export function minimumAgeValidator(minAge: number = 18): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Si aún no ha llegado el mes de cumpleaños o si es el mes pero no ha llegado el día
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { underage: true };
  };
}

export function enrollmentValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    const enrollmentPattern = /^\d{10}$/;
    const valid = enrollmentPattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

// Validador de temperatura
export function temperatureValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const temperaturePattern = /^(3[0-9](\.[0-9]{1,2})?|4[0-4](\.[0-9]{1,2})?|45(\.[0-9]{1,2})?)$/;
    const valid = temperaturePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

// Validador de frecuencia cardíaca
export function heartRateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const heartRatePattern = /^(?:[4-9]\d|1\d{2}|200)$/;
    const valid = heartRatePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

// Validador de frecuencia respiratoria
export function respiratoryRateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const respiratoryRatePattern = /^(?:1[2-9]|2\d|30)$/;
    const valid = respiratoryRatePattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}

// Validador de saturación de oxígeno
export function oxygenSaturationValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const oxygenSaturationPattern = /^(?:[9][0-9]|100)$/;
    const valid = oxygenSaturationPattern.test(control.value);
    return valid ? null : { lastError: { value: control.value } };
  };
}