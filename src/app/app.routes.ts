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
import { NomeCompleto } from './components/atualizacao/nome-completo/nome-completo';
import { Endereco } from './components/atualizacao/endereco/endereco';
import { Cpf } from './components/atualizacao/cpf/cpf';
import { Email } from './components/atualizacao/email/email';
import { Sexo } from './components/atualizacao/sexo/sexo';
import { Telefone } from './components/atualizacao/telefone/telefone';
import { AtualizacaoPessoa } from './components/atualizacao/atualizacao-pessoa/atualizacao-pessoa';
import { AtualizacaoLivro } from './components/atualizacao/atualizacao-livro/atualizacao-livro';
import { AtualizacaoFuncionario } from './components/atualizacao/atualizacao-funcionario/atualizacao-funcionario';


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
        path: "atualizacao/pessoa",
        component: AtualizacaoPessoa
    },
    {
        path: "atualizacao/funcionario",
        component: AtualizacaoFuncionario
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

    ,{
        path: 'atualizacao/nome-completo',
        component: NomeCompleto
    }

    ,{
        path: 'atualizacao/endereco',
        component: Endereco
    }

    ,{
        path: 'atualizacao/cpf',
        component: Cpf
    }

    ,{
        path: 'atualizacao/email',
        component: Email
    }

    ,{
        path: 'atualizacao/sexo',
        component: Sexo
    }


        ,{
            path: 'atualizacao/telefone',
            component: Telefone
        },

    {
        path: 'atualizacao/livro',
        component: AtualizacaoLivro
    }

];
