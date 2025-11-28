import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-componente-estadisticas-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './componente-estadisticas-admin.html',
  styleUrl: './componente-estadisticas-admin.css',
})
export class ComponenteEstadisticasAdmin {

  constructor(private router: Router){}

  irATurnosPorEspecialidad(){
    this.router.navigateByUrl("estadisticas/turnos-especialidad")
  }

  irATurnosPorDia(){
    this.router.navigateByUrl("estadisticas/turnos-dia")
  }

  irATurnosPorEspecialista(){
    this.router.navigateByUrl("estadisticas/turnos-especialista")
  }

  irATurnosFinalizados(){
    this.router.navigateByUrl("estadisticas/turnos-finalizados")
  }

}
