import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'statusColor', standalone: true })
export class StatusColorPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
