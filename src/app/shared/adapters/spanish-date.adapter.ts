import { NativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Inject, Injectable, Optional } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

const SPANISH_MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const SPANISH_DAYS = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

@Injectable()
export class SpanishDateAdapter extends NativeDateAdapter {
  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string
  ) {
    super(matDateLocale);
  }

  override getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => String(i + 1));
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' ? [...SPANISH_MONTHS] : SPANISH_MONTHS.map(m => m.substring(0, 3));
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' 
      ? [...SPANISH_DAYS] 
      : SPANISH_DAYS.map(day => day.substring(0, 3));
  }
  override format(date: Date, displayFormat: Object): string {
    if (this.isValid(date)) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      if (displayFormat === 'input') {
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
      }
      
      return `${day} de ${SPANISH_MONTHS[date.getMonth()]} de ${year}`;
    }
    
    return '';
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return super.parse(value);
  }
}