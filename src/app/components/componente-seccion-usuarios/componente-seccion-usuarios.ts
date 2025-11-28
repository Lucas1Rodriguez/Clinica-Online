import { Component } from '@angular/core';
import { Supabase } from '../../services/supabase';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Turnos } from '../../services/turnos';
import * as XLSX from 'xlsx';
import { RolLabelPipe } from '../../pipes/rol-label-pipe';
import { CapitalizarPipe } from '../../pipes/capitalizar-pipe';

@Component({
  selector: 'app-componente-seccion-usuarios',
  imports: [CommonModule, FormsModule, RolLabelPipe, CapitalizarPipe],
  templateUrl: './componente-seccion-usuarios.html',
  styleUrl: './componente-seccion-usuarios.css',
})
export class ComponenteSeccionUsuarios {

  usuarios: any[] = [];
  cargando: boolean = true;

  constructor(private supabaseService: Supabase, private turnosService: Turnos) {}

  async ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando = true;

    this.usuarios = await this.supabaseService.obtenerTodosLosUsuarios();

    if (!this.usuarios || this.usuarios.length === 0) {
      Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
    }

    this.cargando = false;
  }

  async cambiarEstado(especialista: any) {
    const nuevoEstado = !especialista.habilitado;

    const { error } = await this.supabaseService.cambiarEstadoEspecialista(
      especialista.idEspecialista,
      nuevoEstado
    );

    if (error) {
      Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
      return;
    }

    especialista.habilitado = nuevoEstado;

    Swal.fire({
      icon: 'success',
      title: `Especialista ${nuevoEstado ? 'Habilitado' : 'Inhabilitado'}`,
      timer: 1200,
      showConfirmButton: false
    });
  }

  descargarExcel() {
    if (!this.usuarios || this.usuarios.length === 0) {
      Swal.fire("Error", "No hay usuarios cargados", "error");
      return;
    }

    const excelData = this.usuarios.map(u => ({
      Nombre: `${u.nombre} ${u.apellido}`,
      DNI: u.dni,
      Email: u.mail,
      Rol: u.rol,
      ObraSocial: u.obraSocial || "-",
      Habilitado: u.habilitado !== undefined ? (u.habilitado ? "Sí" : "No") : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    XLSX.writeFile(workbook, "usuarios_general.xlsx");
  }

  async descargarExcelPaciente(usuario: any) {
 
    const turnos = await this.turnosService.getTurnosPorPaciente(usuario.id);

    if (!turnos || turnos.length === 0 && usuario.rol === 'paciente') {
      Swal.fire("Sin turnos", "El paciente no tiene turnos registrados.", "info");
      return;
    }else if (usuario.rol === 'especialista' || usuario.rol === 'admin'){
      return;
    }

      const getEspecialistaNombre = (esp: any): string => {
        if (!esp) return "Desconocido";

        if (typeof esp === "object") {
          return `${esp.nombre ?? ''} ${esp.apellido ?? ''}`.trim() || "Desconocido";
        }
        return String(esp);
      };

      const excelData = turnos.map(t => ({
        Fecha: `${t.fecha.split("-").reverse().join("/")} ${t.hora}`,
        Estado: t.estado,
        Especialidad: t.especialidad,
        Especialista: getEspecialistaNombre(t.especialista)
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Turnos");

      XLSX.writeFile(
        workbook,
        `turnos_${usuario.apellido}_${usuario.nombre}.xlsx`
      );
  }
}
