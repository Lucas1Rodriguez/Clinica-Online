import { Component, OnInit } from '@angular/core';
import { Turnos } from '../../../services/turnos';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import Swal from 'sweetalert2';

registerLocaleData(localeEs);

@Component({
  selector: 'app-componente-solicitar-turno',
  imports: [CommonModule, FormsModule],
  templateUrl: './componente-solicitar-turno.html',
  styleUrl: './componente-solicitar-turno.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } // <-- cambia el locale global a español
  ]
})
export class ComponenteSolicitarTurno {
  cargando = true;
  usuarioId: string | null = null;
  rol: 'paciente' | 'admin' = 'paciente';

  especialidades: string[] = [];
  especialistas: any[] = [];
  especialistasFiltrados: any[] = [];

  diasDisponibles: Date[] = [];
  horasDisponibles: string[] = [];

  especialidadSeleccionada: string | null = null;
  especialistaSeleccionado: any = null;
  diaSeleccionado: Date | null = null;
  horaSeleccionada: string | null = null;

  pacienteSeleccionado: any = null;
  pacientes: any[] = [];

  constructor(private supabase: Supabase, private turnosService: Turnos) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.usuarioId = user?.id ?? null;

    this.especialidades = (await this.turnosService.getEspecialidades());
    this.especialistas = await this.turnosService.getEspecialistas();

    if (user?.role === 'admin') {
      this.rol = 'admin';
      const { data } = await this.supabase.getCliente()
        .from('usuarios')
        .select('*')
        .eq('rol', 'paciente');
      this.pacientes = data || [];
    }

    this.cargando = false;
  }

  async seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = null;
    this.especialistasFiltrados = [];

    if (!especialidad) return;

    const pacienteId = this.rol === 'paciente'
      ? this.usuarioId
      : this.pacienteSeleccionado?.id;

    if (pacienteId) {
      const yaTiene = await this.turnosService.tieneTurnoDeEspecialidad(pacienteId, especialidad);

      if (yaTiene) {
        Swal.fire(
          'Turno existente',
          'Ya tenés un turno de esta especialidad. No podés solicitar otro.',
          'warning'
        );
        return;
      }
    }

    this.especialidadSeleccionada = especialidad;

    this.especialistaSeleccionado = null;
    this.diasDisponibles = [];
    this.horasDisponibles = [];

    this.especialistasFiltrados = this.especialistas
      .filter(e => e.especialidades.includes(especialidad))
      .map(e => ({ id: e.id, nombre: e.nombre }));
  }

  async seleccionarEspecialista(id: string) {
    this.especialistaSeleccionado = this.especialistasFiltrados.find(e => e.id == id);
    this.diaSeleccionado = null;
    this.horasDisponibles = [];

    if (this.especialistaSeleccionado) {
      const dias = await this.turnosService.getDiasDisponibles(this.especialistaSeleccionado.id);

      this.diasDisponibles = dias.map((d: string | Date) => new Date(d));
      console.log("DIAS DEL SERVICIO:", dias);
    }
  }

  async seleccionarDia(dia: Date) {
    this.diaSeleccionado = dia;
    this.horaSeleccionada = null;

    if (this.especialistaSeleccionado && this.diaSeleccionado) {
      this.horasDisponibles = await this.turnosService.getHorasDisponibles(
        this.especialistaSeleccionado.id,
        this.diaSeleccionado
      );
    }
  }

  async solicitarTurno() {
    const pacienteId = this.rol === 'paciente' ? this.usuarioId : this.pacienteSeleccionado?.id;

    if (!this.especialidadSeleccionada || !this.especialistaSeleccionado || !this.diaSeleccionado || !this.horaSeleccionada || !pacienteId) {
      Swal.fire('Error', 'Completa todos los campos.', 'error');
      return;
    }

    try {
      const turno = await this.turnosService.solicitarTurno({
        pacienteId,
        especialistaId: this.especialistaSeleccionado.id,
        fecha: this.diaSeleccionado,
        hora: this.horaSeleccionada,
        especialidad: this.especialidadSeleccionada
      });

      if (turno) {
        Swal.fire('Turno solicitado', 'El turno se registró correctamente.', 'success');
        this.especialidadSeleccionada = null;
        this.especialistaSeleccionado = null;
        this.diaSeleccionado = null;
        this.horaSeleccionada = null;
        this.pacienteSeleccionado = null;
        this.diasDisponibles = [];
        this.horasDisponibles = [];
        this.especialistasFiltrados = [];
      } else {
        Swal.fire('Error', 'No se pudo registrar el turno.', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Ocurrió un problema al registrar el turno.', 'error');
    }
  }
}
