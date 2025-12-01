import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuLateral } from '../cards/menu/menu-lateral';
import { CommonModule } from '@angular/common';
import { Perfil } from '../cards/menu/conteudo/perfil/perfil';
import { ListaClientes } from '../cards/menu/conteudo/lista-clientes/lista-clientes';
import { ListaFuncionarios } from '../cards/menu/conteudo/lista-funcionarios/lista-funcionarios';
import { ListaAutores } from '../cards/menu/conteudo/lista-autores/lista-autores';
import { ListaEditoras } from '../cards/menu/conteudo/lista-editoras/lista-editoras';
import { ListaEdicoes } from '../cards/menu/conteudo/lista-edicoes/lista-edicoes';
import { ListaEmprestimos } from '../cards/menu/conteudo/lista-emprestimos/lista-emprestimos';
import { ListaTitulos } from '../cards/menu/conteudo/lista-titulos/lista-titulos';
import { ListaIdiomas } from '../cards/menu/conteudo/lista-idiomas/lista-idiomas';
import { ListaCategorias } from '../cards/menu/conteudo/lista-categorias/lista-categorias';

@Component({
  selector: 'app-menu-principal',
  imports: [MenuLateral, CommonModule, Perfil, ListaClientes, ListaFuncionarios, ListaAutores, ListaEditoras, ListaEdicoes, ListaEmprestimos, ListaTitulos, ListaIdiomas, ListaCategorias],
  templateUrl: './menu-principal.html',
  styleUrl: './menu-principal.css'
})
export class MenuPrincipal implements OnInit {

  public role!: string;
  public roleCards: string[] = [];

  public cardsCliente: string[] = ['Dados cadastrais', 'Emprestimos'];
  public cardsFuncionario: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Titulos', 'Autores', 'Editoras', 'Idiomas', 'Categorias', 'Funcionários'];
  public cardsAdministrador: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Titulos', 'Autores', 'Editoras', 'Idiomas', 'Categorias', 'Funcionários', 'Relatórios'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // tenta ler role do decodedToken salvo no sessionStorage
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string };
        this.role = decoded?.role ?? '';
      } else {
        this.role = '';
      }
    } catch (e) {
      console.error('Erro ao ler role do sessionStorage:', e);
      this.role = '';
    }

    this.assignRole(this.role);

    // Verifica se há um estado passado pela navegação
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    console.log('[MenuPrincipal] Estado recebido:', state);
    console.log('[MenuPrincipal] Role do usuário:', this.role);
    
    if (state?.selectedCard) {
      console.log('[MenuPrincipal] Selecionando card:', state.selectedCard);
      this.selectCard(state.selectedCard);
    } else {
      console.log('[MenuPrincipal] Nenhum card selecionado, definindo padrão baseado na role');
      // Define um card padrão baseado na role
      if (this.role === 'CLIENTE') {
        this.selectCard('Dados cadastrais');
      }
    }
  }

  public assignRole(role: string) {
    this.role = role;

    if (role === 'CLIENTE') {
      this.roleCards = this.cardsCliente;
    } else if (role === 'BIBLIOTECARIO') {
      this.roleCards = this.cardsFuncionario;
    } else if (role === 'ADMINISTRADOR') {
      this.roleCards = this.cardsAdministrador;
    } else {
      // padrão: administrador (ou vazio)
      this.roleCards = this.cardsAdministrador;
    }
  }

  // helper to build same path pattern used elsewhere
  public fullPath(name: string): string {
    const slug = name
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    return `components/${slug}`;
  }

  public selectedCard: string | null = null;
  public selectedEmail?: string;

  public selectCard(name: string, ev?: Event) {
    if (ev) ev.preventDefault?.();
    this.selectedCard = name;

    if (name === 'Dados cadastrais') {
      // try several places to find a user's email
      const username = sessionStorage.getItem('username');
      if (username) {
        this.selectedEmail = username;
        return;
      }

      try {
        const raw = sessionStorage.getItem('decodedToken');
        if (raw) {
          const decoded = JSON.parse(raw) as any;
          // common fields: sub, email, username
          this.selectedEmail = decoded?.email ?? decoded?.sub ?? undefined;
        }
      } catch (e) {
        console.warn('menu-principal: erro ao ler decodedToken', e);
        this.selectedEmail = undefined;
      }
    } else {
      this.selectedEmail = undefined;
    }
  }
}
