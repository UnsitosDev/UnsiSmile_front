import { ValidatorFn } from '@angular/forms';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  type: string;
  name: string;
  label: string;
  required?: boolean;
  options?: FormFieldOption[];
  validators?: ValidatorFn[];
  value?: any;
  errorMessages?: { [key: string]: string };
}