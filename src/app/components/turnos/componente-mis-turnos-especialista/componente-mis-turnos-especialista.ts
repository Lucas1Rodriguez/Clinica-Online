import { Component, OnInit } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { Turnos } from '../../../services/turnos';
import { Turno, EstadoTurno } from '../../../models/turno.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-mis-turnos-especialista',
  imports: [CommonModule],
  templateUrl: './componente-mis-turnos-especialista.html',
  styleUrl: './componente-mis-turnos-especialista.css',
})
export class ComponenteMisTurnosEspecialista {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialistaId: string | null = null;
  cargando = true;

  constructor(
    private supabase: Supabase,
    private turnosService: Turnos
  ) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.especialistaId = user?.id ?? null;

    if (this.especialistaId) {
      this.turnos = await this.turnosService.getTurnosPorEspecialista(this.especialistaId);
      
      console.log('Turnos normalizados:', this.turnos);
      this.turnos = this.turnos.map(t => ({
        ...t,
        pacienteNombre: typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
      }));
      
      this.turnosFiltrados = this.turnos.filter(t => t.estado !== EstadoTurno.Cancelado && t.estado !== EstadoTurno.Rechazado);
    }

    this.cargando = false;
  }

  async aceptarTurno(turno: Turno) {
    await this.turnosService.actualizarEstado(turno.id, 'Aceptado');
    await Swal.fire('Turno aceptado', '', 'success');
    this.recargarTurnos();
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
      const actualizado = await this.turnosService.actualizarTurno(turno.id, 'Cancelado', comentario);
      console.log(actualizado)

      if (actualizado != null) {
        turno.estado = EstadoTurno.Cancelado;
        turno.comentario_especialista = comentario;
      }

      await Swal.fire({
        title: 'Turno cancelado',
        text: 'El turno fue cancelado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      await this.recargarTurnos();
    }
  }

  async rechazarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Rechazar turno',
      input: 'text',
      inputLabel: 'Motivo del rechazo',
      inputValidator: v => !v ? 'Debes escribir un motivo' : null,
      showCancelButton: true
    });
    if (comentario) {
      await this.turnosService.actualizarTurno(turno.id, 'Rechazado', comentario);
      await Swal.fire('Turno rechazado', '', 'success');
      this.recargarTurnos();
    }
  }

  async finalizarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Finalizar turno',
      input: 'textarea',
      inputLabel: 'Escribe una reseña o diagnóstico',
      inputValidator: v => !v ? 'Debes escribir una reseña' : null,
      showCancelButton: true
    });
    if (comentario) {
      await this.turnosService.finalizarTurno(turno.id, comentario);
      await Swal.fire('Turno finalizado', '', 'success');
      this.recargarTurnos();
    }
  }

  async recargarTurnos() {
    if (this.especialistaId) {
      this.turnos = await this.turnosService.getTurnosPorEspecialista(this.especialistaId);
      
      this.turnos = this.turnos.map(t => ({
        ...t,
        pacienteNombre: typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
      }));
      
      this.turnosFiltrados = this.turnos.filter(t => t.estado !== EstadoTurno.Cancelado && t.estado !== EstadoTurno.Rechazado);
    }
  }

  verResena(resena: string) {
    Swal.fire('Reseña del turno', resena, 'info');
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

