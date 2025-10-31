import { Component, OnInit } from '@angular/core';
import { MenuLateral } from '../cards/menu/menu-lateral';
import { CommonModule } from '@angular/common';
import { Perfil } from '../cards/menu/conteudo/perfil/perfil';

@Component({
  selector: 'app-menu-principal',
  imports: [MenuLateral, CommonModule, Perfil],
  templateUrl: './menu-principal.html',
  styleUrl: './menu-principal.css'
})
export class MenuPrincipal implements OnInit {

  public role!: string;
  public roleCards: string[] = [];

  public cardsCliente: string[] = ['Dados cadastrais', 'Emprestimos'];
  public cardsFuncionario: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Autores', 'Editoras', 'Funcionários'];
  public cardsAdministrador: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Autores', 'Editoras', 'Funcionários', 'Relatórios'];

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
  }

  public assignRole(role: string) {
    this.role = role;

    if (role === 'CLIENTE') {
      this.roleCards = this.cardsCliente;
    } else if (role === 'FUNCIONARIO') {
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
