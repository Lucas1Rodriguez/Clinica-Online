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
import { ComponenteBienvenida } from './components/componente-bienvenida/componente-bienvenida';
import { ComponenteSeccionUsuarios } from './components/componente-seccion-usuarios/componente-seccion-usuarios';
import { ComponenteHistorialEspecialista } from './components/historial_clinico/componente-historial-especialista/componente-historial-especialista';
import { ComponenteHistorialAdmin } from './components/historial_clinico/componente-historial-admin/componente-historial-admin';
import { ComponenteLogsAdmin } from './components/logs/componente-logs-admin/componente-logs-admin';
import { ComponenteEstadisticasAdmin } from './components/estadisticas/componente-estadisticas-admin/componente-estadisticas-admin';
import { ComponenteEstadisticasTurnosEspecialidad } from './components/estadisticas/componente-estadisticas-turnos-especialidad/componente-estadisticas-turnos-especialidad';
import { ComponenteEstadisticasTurnosDia } from './components/estadisticas/componente-estadisticas-turnos-dia/componente-estadisticas-turnos-dia';
import { ComponenteEstadisticasTurnosEspecialistaPorFecha } from './components/estadisticas/componente-estadisticas-turnos-especialista-por-fecha/componente-estadisticas-turnos-especialista-por-fecha';
import { ComponenteEstadisticasTurnosFinalizadosPorFecha } from './components/estadisticas/componente-estadisticas-turnos-finalizados-por-fecha/componente-estadisticas-turnos-finalizados-por-fecha';

export const routes: Routes = [

    {
        path: '',
        redirectTo: "/bienvenida",
        pathMatch: "full"
    },
    {
        path: "home",
        component: ComponenteHome,
        data: { animation: 'paginaHome' }
    },
    {
        path: "bienvenida",
        component: ComponenteBienvenida,
        data: { animation: 'paginaBienvenida' }
    },
    {
        path: "login",
        component: ComponenteLogin,
        data: { animation: 'paginaLogin' }
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
        ],
        data: { animation: 'paginaRegistro' }
    },
    {
        path: "seccion-usuarios",
        component: ComponenteSeccionUsuarios,
        data: { animation: 'paginaUsuarios' }
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
        component: ComponenteTurnosAdmin,
        data: { animation: 'paginaTurnos' }
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
        path: "historial-especialista",
        component: ComponenteHistorialEspecialista
    },
    {
        path: "historial-admin",
        component: ComponenteHistorialAdmin
    },
    {
        path: "logs",
        component: ComponenteLogsAdmin
    },
    {
        path: "estadisticas",
        component: ComponenteEstadisticasAdmin,
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./components/estadisticas/estadisticas-module').then(m => m.EstadisticasModule)
            }
        ],
        data: { animation: 'paginaEstadisticas' }
    },
    {
        path: "**",
        component: ComponenteBienvenida
    }
];
