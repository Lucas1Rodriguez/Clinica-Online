import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'rolLabel'})

export class RolLabelPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case 'admin': return 'Administrador';
      case 'paciente': return 'Paciente';
      case 'especialista': return 'Especialista';
      default: return 'Desconocido';
    }
  }
  
}