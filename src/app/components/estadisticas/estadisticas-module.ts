import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponenteEstadisticasTurnosDia } from './componente-estadisticas-turnos-dia/componente-estadisticas-turnos-dia';
import { ComponenteEstadisticasTurnosEspecialidad } from './componente-estadisticas-turnos-especialidad/componente-estadisticas-turnos-especialidad';
import { ComponenteEstadisticasTurnosEspecialistaPorFecha } from './componente-estadisticas-turnos-especialista-por-fecha/componente-estadisticas-turnos-especialista-por-fecha';
import { ComponenteEstadisticasTurnosFinalizadosPorFecha } from './componente-estadisticas-turnos-finalizados-por-fecha/componente-estadisticas-turnos-finalizados-por-fecha';

const routes: Routes = [
  { path: 'turnos-especialidad', component: ComponenteEstadisticasTurnosEspecialidad },
  { path: 'turnos-dia', component: ComponenteEstadisticasTurnosDia },
  { path: 'turnos-especialista', component: ComponenteEstadisticasTurnosEspecialistaPorFecha},
  { path: 'turnos-finalizados', component: ComponenteEstadisticasTurnosFinalizadosPorFecha},
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponenteEstadisticasTurnosEspecialidad,
    ComponenteEstadisticasTurnosDia,
    ComponenteEstadisticasTurnosEspecialistaPorFecha,
    ComponenteEstadisticasTurnosFinalizadosPorFecha,
    RouterModule.forChild(routes)
  ]
})
export class EstadisticasModule { }
