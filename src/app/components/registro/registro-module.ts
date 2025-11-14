import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponenteRegistroUsuario } from './componente-registro-usuario/componente-registro-usuario';
import { ComponenteRegistroEspecialista } from './componente-registro-especialista/componente-registro-especialista';
import { ComponenteRegistroAdmin } from './componente-registro-admin/componente-registro-admin';

const routes: Routes = [
  { path: 'usuario', component: ComponenteRegistroUsuario },
  { path: 'especialista', component: ComponenteRegistroEspecialista },
  { path: 'admin', component: ComponenteRegistroAdmin}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponenteRegistroUsuario,
    ComponenteRegistroEspecialista,
    ComponenteRegistroAdmin,
    RouterModule.forChild(routes)
  ]
})
export class RegistroModule { }
