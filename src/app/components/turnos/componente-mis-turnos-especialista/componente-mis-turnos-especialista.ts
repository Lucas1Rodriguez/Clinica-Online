import { Component, OnInit } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { Turnos } from '../../../services/turnos';
import { Turno, EstadoTurno } from '../../../models/turno.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-mis-turnos-especialista',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './componente-mis-turnos-especialista.html',
  styleUrl: './componente-mis-turnos-especialista.css',
})
export class ComponenteMisTurnosEspecialista {
  turnos: Turno[] = [];
  turnosFiltrados: Turno[] = [];
  especialistaId: string | null = null;
  cargando = true;
  mostrarModal = false;
  form!: FormGroup;
  dinamicos: { clave: string; valor: string }[] = [];
  turnoSeleccionado: Turno | null = null;
  pacientesAtendidos: any[] = [];

  constructor(
    private supabase: Supabase,
    private turnosService: Turnos,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.especialistaId = user?.id ?? null;

    this.form = this.fb.group({
      altura: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      peso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      temperatura: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
      presion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]]
    });

    if (this.especialistaId) {
      this.turnos = await this.turnosService.getTurnosPorEspecialista(this.especialistaId);

      this.turnos = this.turnos.map(t => ({
        ...t,
        pacienteNombre: typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
      }));

      this.turnosFiltrados = this.turnos.filter(
        t => t.estado !== EstadoTurno.Cancelado && t.estado !== EstadoTurno.Rechazado
      );

      for (let turno of this.turnos) {
        const { data: historia } = await this.supabase.getHistoriaPorTurno(turno.id);
        turno.historiaClinica = historia ?? null;
      }
    }

    this.cargando = false;
  }

  async aceptarTurno(turno: Turno) {
    await this.turnosService.actualizarEstado(turno.id, 'Aceptado');
    await Swal.fire('Turno aceptado', '', 'success');
    this.recargarTurnos();
  }

  async cancelarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Cancelar turno',
      input: 'text',
      inputLabel: 'Motivo de la cancelación',
      inputValidator: v => !v ? 'Debes escribir un motivo' : null,
      showCancelButton: true
    });

    if (!comentario) return;

    const actualizado = await this.turnosService.actualizarTurno(
      turno.id,
      'Cancelado',
      comentario
    );

    if (actualizado) {
      turno.estado = EstadoTurno.Cancelado;
      turno.comentario_especialista = comentario;
    }

    await Swal.fire('Turno cancelado', '', 'success');
    this.recargarTurnos();
  }

  async rechazarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Rechazar turno',
      input: 'text',
      inputLabel: 'Motivo del rechazo',
      inputValidator: v => !v ? 'Debes escribir un motivo' : null,
      showCancelButton: true
    });

    if (!comentario) return;

    await this.turnosService.actualizarTurno(turno.id, 'Rechazado', comentario);
    await Swal.fire('Turno rechazado', '', 'success');
    this.recargarTurnos();
  }

  abrirModal(turno: Turno) {
    this.turnoSeleccionado = turno;
    this.dinamicos = [];
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.form.reset();
  }

  async finalizarTurno(turno: Turno) {
    const { value: comentario } = await Swal.fire({
      title: 'Finalizar turno',
      input: 'textarea',
      inputLabel: 'Escribe un comentario breve',
      inputValidator: v => !v ? 'Debes escribir un comentario' : null,
      showCancelButton: true
    });

    if (!comentario) return;

    turno.comentario_especialista = comentario;

    this.abrirModal(turno);
  }

  agregarDato() {
    if (this.dinamicos.length >= 3) return;
    this.dinamicos.push({ clave: '', valor: '' });
  }

  eliminarDato(i: number) {
    this.dinamicos.splice(i, 1);
  }

  async guardarHistoriaClinica() {
    if (!this.turnoSeleccionado) return;

    if (this.form.valid) {
      
      console.log('dinamicos antes de filtrar:', this.dinamicos);

      const datosDinamicos = this.dinamicos.filter(
        d => d.clave?.toString().trim() !== '' && d.valor?.toString().trim() !== ''
      );

      const historia = {
        paciente_id: this.turnoSeleccionado.paciente_id,
        especialista_id: this.turnoSeleccionado.especialista_id,
        turno_id: this.turnoSeleccionado.id,
        altura: this.form.value.altura,
        peso: this.form.value.peso,
        temperatura: this.form.value.temperatura,
        presion: this.form.value.presion,
        datos_dinamicos: datosDinamicos,
        especialidad: this.turnoSeleccionado.especialidad
      };

      console.log("Historia creada:", historia);
      await this.supabase.guardarHistoriaClinica(historia);

      await this.turnosService.finalizarTurno(
        this.turnoSeleccionado.id,
        this.turnoSeleccionado.comentario_especialista || ""
      );

      Swal.fire("Guardado", "Turno finalizado. Historia clínica registrada correctamente", "success");

      this.cerrarModal();
      this.recargarTurnos();


    } else{

      const altura = this.form.get('altura');
      const peso = this.form.get('peso');
      const temperatura = this.form.get('temperatura');
      const presion = this.form.get('presion');

      const camposInvalidos = [altura, peso, temperatura, presion]
      .filter(campo => campo?.invalid);

      if (camposInvalidos.length > 1) {
        Swal.fire({
          title: '<strong>Formulario incompleto</strong>',
          html: 'Por favor, completa correctamente todos los campos obligatorios.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      } else if (camposInvalidos.length === 1) 
      {
        const campo = camposInvalidos[0];
        let mensaje = '';
        switch (campo) {
          case altura:
            mensaje = 'La altura debe contener entre 2 y 3 caracteres.';
            break;
          case peso:
            mensaje = 'El peso debe contener entre 2 y 3 caracteres.';
            break;
          case temperatura:
            mensaje = 'La temperatura debe contener entre 2 y 3 caracteres.';
            break;
          case presion:
            mensaje = 'La presion debe debe contener entre 2 y 3 caracteres.';
            break;
        }
        Swal.fire({
          title: '<strong>Campo inválido</strong>',
          html: mensaje,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });

      }
    }
  }

  async recargarTurnos() {
    if (!this.especialistaId) return;

    this.turnos = await this.turnosService.getTurnosPorEspecialista(this.especialistaId);

    for (let turno of this.turnos) {
      const { data: historia } = await this.supabase.getHistoriaPorTurno(turno.id);
      turno.historiaClinica = historia ?? null;
    }

    this.turnos = this.turnos.map(t => ({
      ...t,
      pacienteNombre: typeof t.paciente === 'object' ? t.paciente.nombre : t.paciente_id
    }));

    this.turnosFiltrados = this.turnos.filter(
      t => t.estado !== EstadoTurno.Cancelado && t.estado !== EstadoTurno.Rechazado
    );
  }

  verResena(resena: string) {
    Swal.fire('Reseña del turno', resena, 'info');
  }

  filtrarTurnos(event: any) {
    const valor = event.target.value.toLowerCase();

    this.turnosFiltrados = this.turnos.filter(t => {

      let historiaTexto = '';

      if (t.historiaClinica) {
        const h = t.historiaClinica;

        historiaTexto += `altura: ${h.altura} `;
        historiaTexto += `peso: ${h.peso} `;
        historiaTexto += `temperatura: ${h.temperatura} `;
        historiaTexto += `presion: ${h.presion} `;

        if (h.datos_dinamicos) {
          h.datos_dinamicos.forEach(d => {
            historiaTexto += `${d.clave}: ${d.valor} `;
          });
        }
      }

      const textoBuscado = `
        ${t.especialidad}
        ${t.pacienteNombre}
        ${historiaTexto}
      `.toLowerCase();

      return (
        textoBuscado.includes(valor) &&
        t.estado !== EstadoTurno.Cancelado &&
        t.estado !== EstadoTurno.Rechazado
      );
    });
  }

}