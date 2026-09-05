import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statFormat',
})
export class StatFormatPipe implements PipeTransform {
  transform(value: number, format: 'percent' | 'decimal' | 'integer' = 'integer'): string {
    if (value === null || value === undefined) return '-';

    switch (format) {
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(1);
      case 'integer':
      default:
        return Math.round(value).toString();
    }
  }
}
