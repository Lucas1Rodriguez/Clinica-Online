import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-componente-historial-admin',
  imports: [CommonModule],
  templateUrl: './componente-historial-admin.html',
  styleUrl: './componente-historial-admin.css',
})
export class ComponenteHistorialAdmin {
  modo: 'lista' | 'historia' = 'lista';
  usuarios: any[] = [];
  historialPaciente: any[] = [];
  pacienteSeleccionado: any = null;
  cargando = true;
  cargandoHistorial = false;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const { data } = await this.supabase.getPacientes();
    if(data) this.usuarios = data;
    this.cargando = false;
  }

  async verHistoria(pacienteId: string) {
    this.modo = 'historia';
    this.cargandoHistorial = true;
    this.pacienteSeleccionado = this.usuarios.find(u => u.id === pacienteId);

    const { data, error } = await this.supabase.getHistoriaPorPaciente(this.pacienteSeleccionado.id);
    this.cargandoHistorial = false;
    if (error) {
      console.error(error);
    } else {
      this.historialPaciente = data;
    }
  }

  volver() {
    this.modo = 'lista';
    this.pacienteSeleccionado = null;
    this.historialPaciente = [];
  }
}
