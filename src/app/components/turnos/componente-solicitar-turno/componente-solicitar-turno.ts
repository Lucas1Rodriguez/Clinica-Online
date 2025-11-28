import { Component, OnInit } from '@angular/core';
import { Turnos } from '../../../services/turnos';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import Swal from 'sweetalert2';
import { CapitalizarPipe } from '../../../pipes/capitalizar-pipe';

registerLocaleData(localeEs);

@Component({
  selector: 'app-componente-solicitar-turno',
  imports: [CommonModule, FormsModule, CapitalizarPipe],
  templateUrl: './componente-solicitar-turno.html',
  styleUrl: './componente-solicitar-turno.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
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

  especialidadImagenes: Record<string, string> = {
    "Pediatría": "assets/iconos/pediatria.png",
    "Dermatología": "assets/iconos/dermatologia.png",
    "Cardiología": "assets/iconos/cardiologia.png",
    "Odontología": "assets/iconos/odontologia.png",
    "Neurología": "assets/iconos/neurologia.png",
    "Nutrición": "assets/iconos/nutricion.png",
    "Radiología": "assets/iconos/radiologia.png",
    "Traumatología": "assets/iconos/traumatologia.png",
    "default": "assets/iconos/default.png"
  };

  constructor(private supabase: Supabase, private turnosService: Turnos) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.usuarioId = user?.id ?? null;
    const { data: admin } = await this.supabase.getCliente()
    .from('admins')
    .select('*')
    .eq('id', this.usuarioId)
    .single();

    if (admin) {
      this.rol = 'admin';
    
      const { data: pacientes } = await this.supabase.getCliente()
        .from('usuarios')
        .select('*');

        this.pacientes = pacientes || [];
      } else {
        this.rol = 'paciente';
    }

    this.especialidades = await this.turnosService.getEspecialidades();
    this.especialistas = await this.turnosService.getEspecialistas();

    this.cargando = false;
  }

  async seleccionarEspecialidad(especialidad: string) {
    this.especialidadSeleccionada = especialidad;

    this.diaSeleccionado = null;
    this.horaSeleccionada = null;

    const dias = await this.turnosService.getDiasDisponibles(this.especialistaSeleccionado.id);
    this.diasDisponibles = dias.map((d: string | Date) => new Date(d));

    this.horasDisponibles = [];
  }

  async seleccionarEspecialista(especialista: any) {
    this.especialistaSeleccionado = especialista;

    this.especialidadSeleccionada = null;
    this.diaSeleccionado = null;
    this.horaSeleccionada = null;

    this.especialidades = especialista.especialidades || [];

    this.diasDisponibles = [];
    this.horasDisponibles = [];
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

  cambiarPaciente() {
    this.especialidadSeleccionada = null;
    this.especialistaSeleccionado = null;
    this.diaSeleccionado = null;
    this.horaSeleccionada = null;
    this.especialistasFiltrados = [];
    this.diasDisponibles = [];
    this.horasDisponibles = [];
  }
}
