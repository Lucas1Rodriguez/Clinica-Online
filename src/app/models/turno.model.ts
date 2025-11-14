export enum EstadoTurno {
  Pendiente = 'Pendiente',
  Aceptado = 'Aceptado',
  Cancelado = 'Cancelado',
  Rechazado = 'Rechazado',
  Realizado = 'Realizado'
}

export interface Turno {
  id: string;
  paciente_id: string;
  especialista_id: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: EstadoTurno
  comentario_paciente?: string;
  comentario_especialista?: string;
  comentario_admin?: string;
  resena?: string;
  especialista?: { nombre: string } | string;
  especialistaNombre?: string;
  paciente?: { nombre: string } | string;
  pacienteNombre?: string;
}

