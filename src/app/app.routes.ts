import { Routes } from '@angular/router';
import { ComponenteLogin } from './components/componente-login/componente-login';
import { ComponenteRegistrar } from './components/componente-registrar/componente-registrar';
import { ComponenteHome } from './components/componente-home/componente-home';

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
        path: "registrar",
        component: ComponenteRegistrar
    },
    {
        path: "**",
        component: ComponenteLogin
    }



];
