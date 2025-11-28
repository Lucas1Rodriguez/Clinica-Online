import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import { Turnos } from '../../../services/turnos';

@Component({
  selector: 'app-componente-historial-especialista',
  imports: [CommonModule],
  templateUrl: './componente-historial-especialista.html',
  styleUrl: './componente-historial-especialista.css',
})
export class ComponenteHistorialEspecialista {

  modo: 'lista' | 'historia' = 'lista';
  especialistaId: string | null = null;
  historias: any[] = [];
  pacientesUnicos: any[] = [];
  historialPaciente: any[] = [];
  pacienteSeleccionado: any = null;
  cargando = true;
  cargandoHistorial = false;

  constructor(
    private supabase: Supabase,
    private turnos: Turnos
  ) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.especialistaId = user?.id ?? null;

    if(this.especialistaId){

      const { data } = await this.supabase.getHistoriaPorEspecialista(this.especialistaId);

      const mapa = new Map();

      console.log("Historias encontradas:", data);

      if(data === null){
        return;
      }

      for (let h of data) {
        const { data: paciente } = await this.supabase.getPacientePorId(h.paciente_id);

        if (!paciente) continue;

        h.paciente = paciente;

        if (!mapa.has(paciente.id)) {
          mapa.set(paciente.id, paciente);
        }
      }

      this.historias = data;
      this.pacientesUnicos = Array.from(mapa.values());

      for (let p of this.pacientesUnicos) {
        p.ultimosTurnos = await this.cargarUltimosTurnos(p.id);
      }
    }

    this.cargando = false;
  }

  async verHistoria(pacienteId: string) {
    this.cargandoHistorial = true;
    this.modo = 'historia';

    const paciente = await this.supabase.getPacientePorId(pacienteId);
    this.pacienteSeleccionado = paciente.data;

    const { data } = await this.supabase.getHistoriaPorPaciente(pacienteId);
    if(data === null){
      return;
    }
    this.historialPaciente = data;
    this.cargandoHistorial = false;
  }

  async cargarUltimosTurnos(pacienteId: string) {
    const turnos = await this.turnos.getTurnosPorPaciente(pacienteId);

    if (!turnos) return [];

    return turnos
      .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 3);
  }

  volver() {
    this.modo = 'lista';
    this.pacienteSeleccionado = null;
    this.historialPaciente = [];
  }
}
