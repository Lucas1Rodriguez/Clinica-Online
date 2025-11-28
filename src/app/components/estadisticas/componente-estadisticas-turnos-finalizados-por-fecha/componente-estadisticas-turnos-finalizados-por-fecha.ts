import { Component } from '@angular/core';
import { Turnos } from '../../../services/turnos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables, Title } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { HighlightHoverDirective } from '../../../directivas/directivaHighlightHover';
Chart.register(...registerables);

@Component({
  selector: 'app-componente-estadisticas-turnos-finalizados-por-fecha',
  imports: [CommonModule, FormsModule, HighlightHoverDirective],
  templateUrl: './componente-estadisticas-turnos-finalizados-por-fecha.html',
  styleUrl: './componente-estadisticas-turnos-finalizados-por-fecha.css',
})
export class ComponenteEstadisticasTurnosFinalizadosPorFecha {

  
  chart: any;
  graficoFinalizados: any = null;
  fechaDesde: string = '';
  fechaHasta: string = '';
  datosFinalizados: { medico: string; cantidad: number }[] = [];
  graficoFinCargado: boolean = false;

  constructor(private turnosService: Turnos) {}

  async ngOnInit() {
    this.graficoFinCargado = false;
  }

  async cargarTurnosFinalizados() {
    if (!this.fechaDesde || !this.fechaHasta) return;

    if (this.fechaHasta < this.fechaDesde) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        html: 'No puede elegir una fecha anterior a la fecha inicial',
      });
      return;
    }

    const { data, error } = await this.turnosService.getTurnosFinalizadosPorMedico(
      this.fechaDesde,
      this.fechaHasta
    );

    if (error) {
      console.error(error);
      return;
    }

    const conteo: Record<string, number> = {};

    data.forEach(t => {
      const nombre = (t.especialista as any)?.nombre ?? 'Sin nombre';
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    this.datosFinalizados = Object.keys(conteo).map(k => ({
      medico: k,
      cantidad: conteo[k]
    }));

    this.dibujarGraficoFinalizados();
    this.graficoFinCargado = true;
  }

  dibujarGraficoFinalizados() {
    const canvas: any = document.getElementById('graficoFinalizados');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (this.graficoFinalizados) {
      this.graficoFinalizados.destroy();
    }

    this.graficoFinalizados = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.datosFinalizados.map(d => d.medico),
        datasets: [{
          label: 'Turnos Finalizados',
          data: this.datosFinalizados.map(d => d.cantidad),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  parseFechaSinUTC(fecha: string) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  exportarExcelFinalizados() {
    const libro = XLSX.utils.book_new();

    const desdeFmt = this.parseFechaSinUTC(this.fechaDesde).toLocaleDateString('es-AR');
    const hastaFmt = this.parseFechaSinUTC(this.fechaHasta).toLocaleDateString('es-AR');

    const encabezado = [
      ['Informe de Turnos Finalizados'],
      [`Desde: ${desdeFmt}`, `Hasta: ${hastaFmt}`],
      []
    ];

    const hoja = XLSX.utils.aoa_to_sheet(encabezado);

    XLSX.utils.sheet_add_json(
      hoja,
      this.datosFinalizados.map(d => ({ Médicos: d.medico, Cantidad: d.cantidad })),
      { skipHeader: false, origin: encabezado.length }
    );

    XLSX.utils.book_append_sheet(libro, hoja, 'Turnos finalizados');
    XLSX.writeFile(libro, 'turnos_finalizados.xlsx');
  }

  exportarPDFFinalizados() {
    const doc = new jsPDF();
    const hoy = new Date();

    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);
    doc.setFontSize(18);
    doc.text('Turnos Finalizados por Médico', 55, 45);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString('es-AR')} ${hoy.toLocaleTimeString('es-AR')}`, 55, 50);

    const desdeFmt = this.parseFechaSinUTC(this.fechaDesde).toLocaleDateString('es-AR');
    const hastaFmt = this.parseFechaSinUTC(this.fechaHasta).toLocaleDateString('es-AR');

    doc.setFontSize(13);
    doc.text(`Desde: ${desdeFmt}`, 55, 60);
    doc.setFontSize(13);
    doc.text(`Hasta: ${hastaFmt}`, 100, 60);

    const rows = this.datosFinalizados.map(t => [t.medico, t.cantidad]);

    autoTable(doc, {
      startY: 70,
      head: [['Médico', 'Cantidad']],
      body: rows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }
    });

    doc.save('turnos_finalizados_por_medico.pdf');
  }
}
