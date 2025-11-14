import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-mi-perfil-especialista',
  imports: [CommonModule, FormsModule],
  templateUrl: './componente-mi-perfil-especialista.html',
  styleUrl: './componente-mi-perfil-especialista.css',
})
export class ComponenteMiPerfilEspecialista {
   user: any = null;
  especialista: any = null;

  horarios: any[] = [];

  nuevoDia = "";
  horaInicio = "";
  horaFin = "";

  dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const usuario = await this.supabase.obtenerUsuario();
    if (!usuario) return;

    this.user = usuario;

    const { data } = await this.supabase.getCliente()
      .from('especialistas')
      .select('*')
      .eq('id', usuario.id)
      .single();

    this.especialista = data;


    this.horarios = await this.supabase.getHorariosEspecialista(usuario.id);
  }

  async agregar() {

    if (!this.nuevoDia || !this.horaInicio || !this.horaFin) {
      Swal.fire("Error", "Completa todos los campos antes de agregar un horario", "error");
      return;
    }

    if (this.horaFin <= this.horaInicio) {
      Swal.fire("Error", "La hora final debe ser mayor a la hora inicial", "error");
      return;
    }

    const horario = {
      dia: this.nuevoDia,
      hora_inicio: this.horaInicio,
      hora_fin: this.horaFin
    };

    const agregado = await this.supabase.agregarHorario(this.user.id, horario);

    if (agregado) {
      this.horarios.push(horario);

      Swal.fire("Horario agregado", "El horario se agregó correctamente", "success");

      this.nuevoDia = "";
      this.horaInicio = "";
      this.horaFin = "";
    } else {
      Swal.fire("Error", "No se pudo agregar el horario", "error");
    }
  }

  async borrar(i: number) {

    const confirmar = await Swal.fire({
      title: "¿Eliminar horario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmar.isConfirmed) return;

    const eliminado = await this.supabase.eliminarHorario(this.user.id, i);

    if (eliminado) {
      this.horarios.splice(i, 1);
      Swal.fire("Eliminado", "El horario fue eliminado", "success");
    } else {
      Swal.fire("Error", "No se pudo eliminar el horario", "error");
    }
  }
}
