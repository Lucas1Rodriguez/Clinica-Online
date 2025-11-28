import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FechaCortaPipe } from '../../../pipes/fecha-corta-pipe';
import { RolLabelPipe } from '../../../pipes/rol-label-pipe';
import { HighlightHoverDirective } from '../../../directivas/directivaHighlightHover';


@Component({
  selector: 'app-componente-logs-admin',
  standalone: true,
  imports: [CommonModule, FechaCortaPipe, RolLabelPipe, HighlightHoverDirective],
  templateUrl: './componente-logs-admin.html',
  styleUrl: './componente-logs-admin.css',
})
export class ComponenteLogsAdmin {

  logs: any[] = [];
  cargando = true;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getLogsIngresos();
    if (!error) {
      this.logs = data;
    }
    this.cargando = false;
  }

  formatearFecha(f: string) {
    return new Date(f).toLocaleString('es-AR');
  }

  exportarPdf() {
    const doc = new jsPDF();
    const hoy = new Date();

    doc.addImage('assets/logo.png', 'PNG', 90, 4, 25, 25);
    doc.setFontSize(18);
    doc.text('Log de ingresos al sistema', 65, 45);
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString('es-AR')} ${hoy.toLocaleTimeString('es-AR')}`, 65, 50);

    autoTable(doc, {
      startY: 70,
      head: [['Email', 'Rol', 'Fecha']],
      body: this.logs.map(l => [
        l.email,
        l.rol,
        this.formatearFecha(l.fecha)
      ]),
      styles: { halign: 'center' },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 }
    });

    doc.save("log-ingresos.pdf");
  }

  exportarExcel() {
    const datos = this.logs.map(l => ({
      Email: l.email,
      Rol: l.rol,
      Fecha: this.formatearFecha(l.fecha)
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Logs");

    XLSX.writeFile(libro, "log-ingresos.xlsx");
  }

}
