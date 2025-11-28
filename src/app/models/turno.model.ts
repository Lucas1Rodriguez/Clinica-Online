export enum EstadoTurno {
  Pendiente = 'Pendiente',
  Aceptado = 'Aceptado',
  Cancelado = 'Cancelado',
  Rechazado = 'Rechazado',
  Realizado = 'Realizado'
}

export interface HistoriaClinica {
  altura: string;
  peso: string;
  temperatura: string;
  presion: string;
  datos_dinamicos?: { clave: string; valor: string }[];
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
  resenaEspecialista?: string;
  resenaPaciente?: string;
  especialista?: { nombre: string } | string;
  especialistaNombre?: string;
  paciente?: { nombre: string } | string;
  pacienteNombre?: string;
  encuestaCompletada?: boolean
  historiaClinica?: HistoriaClinica | null;
}

