import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Turnos } from '../../../services/turnos';
import { Supabase } from '../../../services/supabase';
import { Turno, EstadoTurno } from '../../../models/turno.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-componente-mis-turnos-usuario',
  templateUrl: './componente-mis-turnos-usuario.html',
  styleUrls: ['./componente-mis-turnos-usuario.css'],
  imports: [CommonModule]
})
export class ComponenteMisTurnosUsuario implements OnInit {
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

  if (this.usuarioId) {
    this.turnos = await this.turnosService.getTurnosPorPaciente(this.usuarioId);

    this.turnos = this.turnos.map(t => ({
      ...t,
      especialistaNombre:
        typeof t.especialista === 'object' ? t.especialista.nombre : t.especialista_id
    }));

    this.turnosFiltrados = this.turnos.filter(t => t.estado !== EstadoTurno.Cancelado);
    console.log('Turnos normalizados:', this.turnos);
  }

  this.cargando = false;
  }

  async cargarTurnos() {
    if (this.usuarioId) {
      this.turnos = await this.turnosService.getTurnosPorPaciente(this.usuarioId);
      this.turnosFiltrados = this.turnos.filter(t => t.estado !== EstadoTurno.Cancelado);

      this.turnos = this.turnos.map(t => ({
        ...t,
        especialistaNombre:
          typeof t.especialista === 'object' ? t.especialista.nombre : t.especialista_id
      }));

    }
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
        turno.comentario_paciente = comentario;
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

  async calificarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Calificar atención',
      input: 'textarea',
      inputLabel: 'Escribe cómo fue tu experiencia con el especialista',
      inputPlaceholder: 'Ej: Muy buena atención, puntual y amable.',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un comentario';
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar calificación',
      icon: 'info'
    });

    if (comentario) {
      await this.turnosService.calificarTurno(turno.id, comentario);

      await Swal.fire({
        title: 'Gracias',
        text: 'Tu reseña fue enviada con éxito.',
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