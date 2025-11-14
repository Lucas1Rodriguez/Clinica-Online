import { Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Turno } from '../models/turno.model';

@Injectable({
  providedIn: 'root',
})
export class Turnos {
  private supabaseClient;

  constructor(private supabase: Supabase) {
    this.supabaseClient = this.supabase.getCliente();
  }

  async getTurnos(): Promise<Turno[]> {
    const { data, error } = await this.supabaseClient
    .from('turnos')
    .select(`*,
      especialista:especialistas(nombre),
      paciente:usuarios(nombre)`)
    .order('fecha', { ascending: true });

    if (error) {
      console.error('Error obteniendo turnos:', error.message);
      return [];
    }

    return data || [];
  }


  async getTurnosPorPaciente(pacienteId: string): Promise<Turno[]> {
    const { data, error } = await this.supabaseClient
    .from('turnos')
    .select(`
      *,
      especialista:especialistas(nombre)
    `)
    .eq('paciente_id', pacienteId)
    .order('fecha', { ascending: true });

    if (error) {
      console.error('Error obteniendo turnos del paciente:', error.message);
      return [];
    }

    return data || [];
  }

 async cancelarTurno(id: string, comentario: string) {

  const { data, error } = await this.supabaseClient
    .from('turnos')
    .update({
      estado: 'Cancelado',
      comentario_paciente: comentario,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();


  if (error) {
    console.error('Error al cancelar turno:', error.message);
    return null;
  }

  if (data && data.length > 0) {
    console.log('✅ Turno actualizado correctamente:', data[0]);
    return data[0];
  } else {
    console.warn('⚠️ No se actualizó ningún turno. ID no encontrado.');
    return null;
  }
}

  async calificarTurno(turnoId: string, comentario: string) {
    await this.supabaseClient
      .from('turnos')
      .update({ resena: comentario })
      .eq('id', turnoId);
  }

  async getTurnosPorEspecialista(especialistaId: string): Promise<Turno[]> {
    const { data, error } = await this.supabaseClient
      .from('turnos')
      .select(`*,
      paciente:usuarios(nombre)`)
      .eq('especialista_id', especialistaId)
      .order('fecha', { ascending: true });

    if (error) {
      console.error('Error obteniendo turnos del especialista:', error.message);
      return [];
    }
    return data || [];
  }

  async actualizarTurno(id: string, estado: string, comentario?: string) {
    const { data, error } = await this.supabaseClient
    .from('turnos')
    .update({
      estado: estado,
      comentario_especialista: comentario,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();


    if (error) {
      console.error('Error al cancelar turno:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      console.log('✅ Turno actualizado correctamente:', data[0]);
      return data[0];
    } else {
      console.warn('⚠️ No se actualizó ningún turno. ID no encontrado.');
      return null;
    }
  }

  async actualizarEstado(id: string, estado: string) {
    return this.actualizarTurno(id, estado);
  }

  async finalizarTurno(id: string, resena: string) {
    const { data, error } = await this.supabaseClient
      .from('turnos')
      .update({
        estado: 'Realizado',
        resena,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();

    if (error) console.error('Error al finalizar turno:', error.message);
    return data;
  }

  async getEspecialidades(): Promise<string[]> {
    const { data, error } = await this.supabaseClient
    .from('especialistas')
    .select('especialidades'); // <-- array de strings

    if (error || !data) return [];

    const todas = data.flatMap((e: any) => e.especialidades || []);

    return Array.from(new Set(todas));
  }

  async getEspecialistas(): Promise<any[]> {
    const { data, error } = await this.supabaseClient
      .from('especialistas')
      .select('*');
    return data || [];
  }

  async getHorariosEspecialista(id: string) {
    const { data, error } = await this.supabaseClient
      .from('especialistas')
      .select('horarios')
      .eq('id', id)
      .single();

    if (error) return null;
    return data.horarios || [];
  }

  async getDiasDisponibles(especialistaId: string, cantidadDias: number = 15) {
    const { data } = await this.supabaseClient
      .from('especialistas')
      .select('horarios')
      .eq('id', especialistaId)
      .single();

    const horarios = data?.horarios ?? [];
    const diasTrabaja = horarios.map((h: any) => h.dia.toLowerCase());

    const hoy = new Date();
    const fechas: Date[] = [];

    for (let i = 0; i < cantidadDias; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() + i);

      const nombreDia = fecha
        .toLocaleDateString('es-ES', { weekday: 'long' })
        .toLowerCase();

      if (diasTrabaja.includes(nombreDia)) {
        fechas.push(fecha);
      }
    }

    return fechas;
  }

  async getHorasDisponibles(especialistaId: string, fecha: Date): Promise<string[]> {
    const horarios = await this.getHorariosEspecialista(especialistaId);
    if (!horarios) return [];

    const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
    const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

    const horario = horarios.find((h: any) => h.dia === diaCapitalizado);
    if (!horario) return [];

    const disponibles = this.generarHorarios(horario.hora_inicio, horario.hora_fin);

    // Turnos ya ocupados
    const { data } = await this.supabaseClient
      .from('turnos')
      .select('hora')
      .eq('especialista_id', especialistaId)
      .eq('fecha', fecha.toISOString().split('T')[0]);

    const ocupadas = data?.map((t: any) => t.hora) || [];

    return disponibles.filter(h => !ocupadas.includes(h));
  }

  private generarHorarios(inicio: string, fin: string): string[] {
    const out: string[] = [];

    let [hI, mI] = inicio.split(':').map(Number);
    let [hF, mF] = fin.split(':').map(Number);

    let min = hI * 60 + mI;
    const max = hF * 60 + mF;

    while (min < max) {
      const h = String(Math.floor(min / 60)).padStart(2, '0');
      const m = String(min % 60).padStart(2, '0');
      out.push(`${h}:${m}`);
      min += 30;
    }

    return out;
  }

  async solicitarTurno(turno: { pacienteId: string, especialistaId: string, fecha: Date, hora: string, especialidad: string}) {
    
    const fechaStr = turno.fecha.toISOString().split('T')[0];

    const { data: existente, error: errorBuscando } = await this.supabaseClient
    .from('turnos')
    .select('id')
    .eq('especialista_id', turno.especialistaId)
    .eq('fecha', fechaStr)
    .eq('hora', turno.hora)
    .eq('especialidad', turno.especialidad);

    if (errorBuscando) {
      console.error("Error verificando duplicados", errorBuscando);
      return null;
    }

    if (existente && existente.length > 0) {
      console.warn("❌ Turno duplicado evitado");
      return null;
    }

    const { data, error } = await this.supabaseClient
      .from('turnos')
      .insert([{
        paciente_id: turno.pacienteId,
        especialista_id: turno.especialistaId,
        fecha: fechaStr,
        hora: turno.hora,
        especialidad: turno.especialidad,
        estado: 'Pendiente',
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select();

    if (error) {
      console.error('Error creando turno:', error.message);
      return null;
    }

    return data[0];
  }

  async tieneTurnoDeEspecialidad(pacienteId: string, especialidad: string) {
  const { data, error } = await this.supabaseClient
    .from('turnos')
    .select('id')
    .eq('paciente_id', pacienteId)
    .eq('especialidad', especialidad)
    .in('estado', ['Pendiente', 'Aceptado']);

  if (error) {
    console.error('Error verificando turno:', error);
    return false;
  }

  return data.length > 0;
}

}


  
