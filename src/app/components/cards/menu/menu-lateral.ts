import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-lateral',
  imports: [CommonModule],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css'
})
export class MenuLateral implements OnInit {
  @Input() title: string = 'Menu';
  // when true, the parent will provide the left menu items via content projection
  @Input() leftFromParent: boolean = false;

  public role: string = '';
  public roleCards: string[] = [];

  public cardsCliente: string[] = ['Dados cadastrais', 'Emprestimos'];
  public cardsFuncionario: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Autores', 'Editoras', 'Funcionários'];
  public cardsAdministrador: string[] = ['Clientes', 'Emprestimos', 'Livros', 'Autores', 'Editoras', 'Funcionários', 'Relatórios'];

  ngOnInit(): void {
    try {
      const raw = sessionStorage.getItem('decodedToken');
      const decoded = raw ? JSON.parse(raw) as { role?: string } : null;
      this.role = decoded?.role ?? '';
    } catch (e) {
      console.error('MenuLateral: erro ao ler decodedToken', e);
      this.role = '';
    }
    this.assignRole(this.role);
  }

  private assignRole(role: string) {
    if (role === 'CLIENTE') this.roleCards = this.cardsCliente;
    else if (role === 'FUNCIONARIO') this.roleCards = this.cardsFuncionario;
    else if (role === 'ADMINISTRADOR') this.roleCards = this.cardsAdministrador;
    else this.roleCards = this.cardsAdministrador;
  }

  public fullPath(name: string): string {
    const slug = name
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
    return `components/${slug}`;
  }
}
