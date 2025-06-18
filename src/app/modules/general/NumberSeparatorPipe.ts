import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSeparator'
})
export class NumberSeparatorPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
