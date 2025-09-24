import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Pessoa } from './components/cadastro/pessoa/pessoa';

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
    }
];
