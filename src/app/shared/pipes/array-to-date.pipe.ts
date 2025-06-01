import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToDate',
  standalone: true
})
export class ArrayToDatePipe implements PipeTransform {
  transform(dateArray: number[], format: 'DMY' | 'YMD' = 'DMY'): string {
    if (!dateArray || dateArray.length < 3) return 'Fecha inválida';

    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day); // JS usa meses 0-indexados

    const pad = (num: number) => String(num).padStart(2, '0');

    switch (format) {
      case 'DMY':
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
      case 'YMD':
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      default:
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
  }
}