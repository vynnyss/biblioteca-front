import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Pessoa } from './components/cadastro/pessoa/pessoa';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { MenuPrincipal } from './components/menu-principal/menu-principal';
import { BookDetails } from './components/livros/book-details';

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
    },
    {
        path: 'livros/:titulo',
        component: BookDetails
    }


   
];
