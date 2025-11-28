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
  selector: 'app-componente-estadisticas-turnos-especialista-por-fecha',
  imports: [CommonModule, FormsModule, HighlightHoverDirective],
  templateUrl: './componente-estadisticas-turnos-especialista-por-fecha.html',
  styleUrl: './componente-estadisticas-turnos-especialista-por-fecha.css',
})
export class ComponenteEstadisticasTurnosEspecialistaPorFecha {

  chart: any;
  graficoMedicos: any = null;
  fechaDesde: string = '';
  fechaHasta: string = '';
  datosMedicos: { medico: string; cantidad: number }[] = [];
  graficoCargado: boolean = false;

  constructor(private turnosService: Turnos) {}

  async ngOnInit() {
    this.graficoCargado = false;
  }

  async cargarTurnosPorMedico() {
      if (!this.fechaDesde || !this.fechaHasta) return;
  
      if (this.fechaHasta < this.fechaDesde) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: 'No puede elegir una fecha anterior a la fecha inicial',
          showConfirmButton: true
        });
        return;
      }
  
      const { data, error } = await this.turnosService.getTurnosPorMedicoFecha(
        this.fechaDesde,
        this.fechaHasta
      );
  
      if (error) {
        console.error(error);
        return;
      }
  
      console.log("DATA TURNO COMPLETO:", data[0]);
  
      const conteo: Record<string, number> = {};
  
      data.forEach(t => {
        const nombre = ( (t.especialista as any)?.nombre ) ?? 'Sin nombre';
        conteo[nombre] = (conteo[nombre] || 0) + 1;
      });
  
      this.datosMedicos = Object.keys(conteo).map(medico => ({
        medico,
        cantidad: conteo[medico]
      }));
  
      this.dibujarGraficoMedicos();
      this.graficoCargado = true;
    }

  dibujarGraficoMedicos() {
    const canvas = document.getElementById('graficoMedicos') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    
    if (!ctx) return;

    if (this.graficoMedicos) this.graficoMedicos.destroy();

    this.graficoMedicos = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.datosMedicos.map(x => x.medico),
        datasets: [{
          label: 'Turnos solicitados',
          data: this.datosMedicos.map(x => x.cantidad)
        }]
      }
    });
  }
  
  parseFechaSinUTC(fecha: string) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  exportarExcelMedicos() {
      const libro = XLSX.utils.book_new();
  
      const desdeFmt = this.parseFechaSinUTC(this.fechaDesde).toLocaleDateString('es-AR');
      const hastaFmt = this.parseFechaSinUTC(this.fechaHasta).toLocaleDateString('es-AR');
  
      const encabezado = [
        ['Informe de Turnos por Especialistas'],
        [`Desde: ${desdeFmt}`, `Hasta: ${hastaFmt}`],
        []
      ];
  
      const hoja = XLSX.utils.aoa_to_sheet(encabezado);
  
      XLSX.utils.sheet_add_json(
        hoja,
        this.datosMedicos.map(d => ({ Médicos: d.medico, Cantidad: d.cantidad })),
        { skipHeader: false, origin: encabezado.length }
      );
  
      XLSX.utils.book_append_sheet(libro, hoja, 'Turnos por Especialista');
      XLSX.writeFile(libro, 'turnos_por_espcialistas.xlsx');
    }

  exportarPDFMedicos() {
    const doc = new jsPDF();
    const hoy = new Date();

    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);
    doc.setFontSize(16);
    doc.text('Turnos solicitados por Médico', 55, 45);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString('es-AR')} ${hoy.toLocaleTimeString('es-AR')}`, 55, 50);

    const desdeFmt = this.parseFechaSinUTC(this.fechaDesde).toLocaleDateString('es-AR');
    const hastaFmt = this.parseFechaSinUTC(this.fechaHasta).toLocaleDateString('es-AR');

    doc.setFontSize(13);
    doc.text(`Desde: ${desdeFmt}`, 55, 60);
    doc.setFontSize(13);
    doc.text(`Hasta: ${hastaFmt}`, 100, 60);

    const rows = this.datosMedicos.map(t => [t.medico, t.cantidad]);

    autoTable(doc, {
      startY: 70,
      head: [['Médico', 'Cantidad']],
      body: rows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }
    });

    doc.save('turnos_por_medico.pdf');
  }
}
