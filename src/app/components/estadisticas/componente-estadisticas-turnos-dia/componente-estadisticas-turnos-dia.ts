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
  selector: 'app-componente-estadisticas-turnos-dia',
  imports: [CommonModule, HighlightHoverDirective],
  templateUrl: './componente-estadisticas-turnos-dia.html',
  styleUrl: './componente-estadisticas-turnos-dia.css',
})
export class ComponenteEstadisticasTurnosDia {

  chart: any;
  graficoDias: any = null;
  datosDias: { dia: string, cantidad: number }[] = [];

  constructor(private turnosService: Turnos) {}

  async ngOnInit() {
    
    const dataPorDia = await this.turnosService.getTurnosPorDia();
    this.cargarGraficoDias(dataPorDia);

  }

  cargarGraficoDias(dataPorDia: any) {
    const labels = Object.keys(dataPorDia);
    const valores = Object.values(dataPorDia) as number[];

    this.datosDias = labels.map((dia, i) => ({
      dia,
      cantidad: valores[i]
    }));

    if (this.graficoDias) {
      this.graficoDias.destroy();
    }

    const ctx = document.getElementById('graficoDias') as HTMLCanvasElement;

    this.graficoDias = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels.map(d => new Date(d).toLocaleDateString('es-AR')),
        datasets: [{
          data: valores,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  exportarExcelDias() {
    const libro = XLSX.utils.book_new();

    const encabezado = [
      ['Informe de Turnos por Día'],
      []
    ];
    
    const hoja = XLSX.utils.aoa_to_sheet(encabezado);    
    
    XLSX.utils.sheet_add_json(
      hoja,
      this.datosDias.map(d => ({ Día: new Date(d.dia).toLocaleDateString('es-AR'), Cantidad: d.cantidad })),
      { skipHeader: false, origin: encabezado.length }
    );

    XLSX.utils.book_append_sheet(libro, hoja, 'Turnos por Día');
    XLSX.writeFile(libro, 'turnos_por_dia.xlsx');
  }


  exportarPDFDias() {
    const doc = new jsPDF();

    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);

    doc.setFontSize(16);
    doc.text('Informe de Turnos por Día', 70, 40);

    doc.setFontSize(10);
    const hoy = new Date();
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString('es-AR')} ${hoy.toLocaleTimeString('es-AR')}`, 70, 45);

    const rows = this.datosDias.map(d => [
      new Date(d.dia).toLocaleDateString('es-AR'),
      d.cantidad
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Día', 'Cantidad de Turnos']],
      body: rows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }
    });

    doc.save('turnos_por_dia.pdf');
  }

}
