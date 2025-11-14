import { Routes } from '@angular/router';
import { ComponenteLogin } from './components/componente-login/componente-login';
import { ComponenteHome } from './components/componente-home/componente-home';
import { ComponenteRegistrar } from './components/registro/componente-registro/componente-registro';
import { ComponenteMisTurnosUsuario } from './components/turnos/componente-mis-turnos-usuario/componente-mis-turnos-usuario';
import { ComponenteMisTurnosEspecialista } from './components/turnos/componente-mis-turnos-especialista/componente-mis-turnos-especialista';
import { ComponenteTurnosAdmin } from './components/turnos/componente-turnos-admin/componente-turnos-admin';
import { ComponenteSolicitarTurno } from './components/turnos/componente-solicitar-turno/componente-solicitar-turno';
import { ComponenteMiPerfilEspecialista } from './components/mi-perfil/componente-mi-perfil-especialista/componente-mi-perfil-especialista';
import { ComponenteMiPerfilUsuario } from './components/mi-perfil/componente-mi-perfil-usuario/componente-mi-perfil-usuario';
import { ComponenteMiPerfilAdmin } from './components/mi-perfil/componente-mi-perfil-admin/componente-mi-perfil-admin';

export const routes: Routes = [

    {
        path: '',
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "home",
        component: ComponenteHome
    },
    {
        path: "login",
        component: ComponenteLogin
    },
    {
        path: "registro",
        component: ComponenteRegistrar,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./components/registro/registro-module').then(m => m.RegistroModule)
            }
        ]
    },
    {
        path: "mis-turnos-usuario",
        component: ComponenteMisTurnosUsuario
    },
    {
        path: "mis-turnos-especialista",
        component: ComponenteMisTurnosEspecialista
    },
    {
       
        path: "turnos-admin",
        component: ComponenteTurnosAdmin
    }, 
    {
        path: "solicitar-turno",
        component: ComponenteSolicitarTurno
    },
    {
        path: "mi-perfil-especialista",
        component: ComponenteMiPerfilEspecialista
    },
    {
        path: "mi-perfil-usuarios",
        component: ComponenteMiPerfilUsuario
    },
    {
        path: "mi-perfil-admin",
        component: ComponenteMiPerfilAdmin
    },
    {
        path: "**",
        component: ComponenteLogin
    }



];
