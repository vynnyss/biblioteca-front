import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Pessoa } from './components/cadastro/pessoa/pessoa';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { MenuPrincipal } from './components/menu-principal/menu-principal';
import { Livro } from './components/cadastro/livro/livro';
import { Autor } from './components/cadastro/autor/autor';
import { Editora } from './components/cadastro/editora/editora';
import { Genero } from './components/cadastro/genero/genero';
import {Idioma} from './components/cadastro/idioma/idioma';
import {Pais} from './components/cadastro/pais/pais';
import { BookDetails } from './components/livros/book-details';
import { Carrinho } from './components/carrinho/carrinho';

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
        path: "cadastro/livro",
        component: Livro
    },

    {
        path: "cadastro/autor",
        component: Autor
    },

        {
        path: "cadastro/editora",
        component: Editora
    },

        {
        path: "cadastro/genero",
        component: Genero
    },

        {
        path: "cadastro/idioma",
        component: Idioma
    },
    
        {
        path: "cadastro/pais",
        component: Pais
    },
        {
        path: 'livros/:titulo',
        component: BookDetails
    },
    {
        path: 'carrinho',
        component: Carrinho
    }


   
];
