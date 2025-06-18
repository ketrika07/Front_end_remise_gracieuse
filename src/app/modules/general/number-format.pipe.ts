// Create a new file: number-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '0,00';
    const number = typeof value === 'string' ? parseFloat(value) : value;
    return number.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
