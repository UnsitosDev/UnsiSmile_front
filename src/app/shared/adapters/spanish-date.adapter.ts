import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class SpanishDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; 
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    return super.parse(value);
  }
}