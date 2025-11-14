import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Turnos } from '../../../services/turnos';
import { Supabase } from '../../../services/supabase';
import { Turno, EstadoTurno } from '../../../models/turno.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-componente-turnos-admin',
  imports: [CommonModule],
  templateUrl: './componente-turnos-admin.html',
  styleUrl: './componente-turnos-admin.css',
})
export class ComponenteTurnosAdmin implements OnInit {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  usuarioId: string | null = null;
  cargando = true;

  constructor(
    private supabase: Supabase,
    private turnosService: Turnos
  ) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.usuarioId = user?.id ?? null;

    this.turnos = await this.turnosService.getTurnos();

    console.log("Turnos RAW desde Supabase:", await this.turnosService.getTurnos());
    this.turnos = this.turnos.map(t => ({
      ...t,
      especialistaNombre:
        typeof t.especialista === 'object' ? t.especialista.nombre : t.especialista_id,
      pacienteNombre:
        typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
    }));

    this.turnosFiltrados = this.turnos.filter(t =>
      !['Aceptado', 'Realizado', 'Rechazado'].includes(t.estado)
    );
    console.log('Turnos normalizados:', this.turnos);

    this.cargando = false;
  }

  async cargarTurnos() {
    this.turnos = await this.turnosService.getTurnos();

    this.turnos = this.turnos.map(t => ({
      ...t,
      especialistaNombre:
        typeof t.especialista === 'object' ? t.especialista.nombre : t.especialista_id,
      pacienteNombre:
        typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
    }));
    this.turnosFiltrados = this.turnos.filter(t =>
      !['Aceptado', 'Realizado', 'Rechazado'].includes(t.estado)
    );
  }

  async cancelarTurno(turno: Turno) {
    console.log('Turno a cancelar:', turno);
    const { value: comentario } = await Swal.fire({
      title: 'Cancelar turno',
      input: 'text',
      inputLabel: 'Motivo de la cancelación',
      inputPlaceholder: 'Escribe tu motivo...',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un motivo';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      icon: 'warning'
    });

    if (comentario) {
      const actualizado = await this.turnosService.cancelarTurno(turno.id, comentario);

      if (actualizado != null) {
        turno.estado = EstadoTurno.Cancelado;
        turno.comentario_admin = comentario;
      }

      await Swal.fire({
        title: 'Turno cancelado',
        text: 'El turno fue cancelado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await this.cargarTurnos();
    }
  }

  filtrarTurnos(event: any) {
    const valor = event.target.value.toLowerCase();
    
    this.turnosFiltrados = this.turnos.filter(t =>
      (
        t.especialidad.toLowerCase().includes(valor) ||
        t.pacienteNombre?.toLowerCase().includes(valor)
      ) &&
      t.estado !== EstadoTurno.Cancelado &&
      t.estado !== EstadoTurno.Rechazado
    );
  }
}
