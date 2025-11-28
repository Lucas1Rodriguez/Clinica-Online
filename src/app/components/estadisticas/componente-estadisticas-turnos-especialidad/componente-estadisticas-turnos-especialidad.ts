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
  selector: 'app-componente-estadisticas-turnos-especialidad',
  imports: [CommonModule, FormsModule, HighlightHoverDirective],
  templateUrl: './componente-estadisticas-turnos-especialidad.html',
  styleUrl: './componente-estadisticas-turnos-especialidad.css',
})
export class ComponenteEstadisticasTurnosEspecialidad {

  chart: any;
  turnosPorEspecialidad: any;

  constructor(private turnosService: Turnos) {}

  objectKeys = Object.keys;

  async ngOnInit(){
    this.turnosPorEspecialidad = await this.turnosService.getTurnosPorEspecialidad();
    
    this.crearGraficoEspecialidades();
  }

    crearGraficoEspecialidades() {
    const labels = Object.keys(this.turnosPorEspecialidad);
    const valores = Object.values(this.turnosPorEspecialidad);

    this.chart = new Chart('graficoEspecialidades', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cantidad de turnos',
          data: valores,
          backgroundColor: 'rgba(41, 165, 214, 0.6)',
        }]
      }
    });
  }

  exportarExcelEspecialidades() {
      const libro = XLSX.utils.book_new();
  
      const encabezado = [
        ['Informe de Turnos por Especialidades'],
        []
      ];
      
      const hoja = XLSX.utils.aoa_to_sheet(encabezado);    
      
      const datos = Object.keys(this.turnosPorEspecialidad).map(k => ({
        Especialidad: k,
        Cantidad: this.turnosPorEspecialidad[k]
      }));


      XLSX.utils.sheet_add_json(
        hoja,
        datos,
        { skipHeader: false, origin: encabezado.length }
      );
  
      XLSX.utils.book_append_sheet(libro, hoja, 'Turnos por Especialidad');
      XLSX.writeFile(libro, 'turnos_por_especialidad.xlsx');
    }
  
  
  exportarPDFEspecialidades() {
    const doc = new jsPDF();
    const hoy = new Date();

    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);
    doc.setFontSize(16);
    doc.text('Informe de Turnos por Especialidad', 60, 40);
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString('es-AR')} ${hoy.toLocaleTimeString('es-AR')}`, 60, 45);

    const rows = Object.keys(this.turnosPorEspecialidad).map(k => [k, this.turnosPorEspecialidad[k]]);

    autoTable(doc, {
      startY: 55,
      head: [['Especialidad', 'Cantidad']],
      body: rows,
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }
    });

    doc.save('turnos_por_especialidad.pdf');
  }

}
