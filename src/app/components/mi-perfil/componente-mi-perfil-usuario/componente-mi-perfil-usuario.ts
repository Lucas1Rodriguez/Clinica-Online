import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-componente-mi-perfil-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './componente-mi-perfil-usuario.html',
  styleUrl: './componente-mi-perfil-usuario.css',
})
export class ComponenteMiPerfilUsuario {
  perfil: any = null;
  usuarioId!: string;
  historial: any[] = [];
  especialidades: string[] = [];
  especialidadSeleccionada: string = '';

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.usuarioId = user?.id ?? "";

    const { data } = await this.supabase.getCliente()
      .from("usuarios")
      .select("*")
      .eq("id", this.usuarioId)
      .single();

      this.perfil = data || {};

      if (!this.perfil.fotos) {
        this.perfil.fotos = [];
      }

      if (typeof this.perfil.fotos === 'object' && !Array.isArray(this.perfil.fotos)) {
        this.perfil.fotos = Object.values(this.perfil.fotos);
      }
      console.log("PERFIL COMPLETO:", this.perfil);

    const { data: histData } = await this.supabase.getHistoriaPorPaciente(this.usuarioId);
    this.historial = histData || [];

    this.especialidades = Array.from(new Set(this.historial.map(h => h.especialidad)));
  }

  descargarPDF() {
    if (!this.especialidadSeleccionada || this.especialidadSeleccionada === null) return;

    const atenciones = this.historial.filter(h => h.especialidad === this.especialidadSeleccionada);

    const doc = new jsPDF();
    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);
    doc.setFontSize(18);
    doc.text("Informe Historia Clínica", 65, 40);
    doc.setFontSize(12);
    doc.text(`Especialidad: ${this.especialidadSeleccionada}`, 65, 50);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 65, 55);

    const tabla = atenciones.map(a => [
      new Date(a.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      a.peso,
      a.altura,
      a.temperatura,
      a.presion,
      a.datos_dinamicos?.map((d: { clave: string, valor: string | number }) => `${d.clave}: ${d.valor}`).join(', ') || ''
    ]);

    autoTable(doc, {
      head: [['Fecha', 'Peso', 'Altura', 'Temp', 'Presión', 'Datos Adicionales']],
      body: tabla,
      startY: 60
    });

    doc.save(`historia_clinica_${this.especialidadSeleccionada}.pdf`);
  }
}

