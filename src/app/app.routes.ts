import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Pessoa } from './components/cadastro/pessoa/pessoa';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { MenuPrincipal } from './components/menu-principal/menu-principal';

export const routes: Routes = [
    {
        path:"",
        component: Home
    },
    {
        path:"home",
        component: Home
    },
    {
        path:"cadastro/pessoa",
        component: Pessoa
    },
    {
        path: "cadastro/funcionario",
        component: Funcionario
    },
    {
        path: "menu-principal",
        component: MenuPrincipal
    }
   
];
