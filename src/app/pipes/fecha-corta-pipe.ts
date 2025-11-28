import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCorta'
})
export class FechaCortaPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';
    
    const fecha = new Date(value);

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    return `${fecha.toLocaleDateString('es-AR', opcionesFecha)} ${fecha.toLocaleTimeString('es-AR', opcionesHora)}`;
  }
}