import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecodeToken } from '../../../models/decode-token';

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
      if (raw) {
        const decoded: DecodeToken = JSON.parse(raw);
        this.role = decoded.role ?? '';
      } else {
        this.role = '';
      }
    } catch (e) {
      console.error('MenuLateral: erro ao ler decodedToken', e);
      this.role = '';
    }
    this.assignRole(this.role);
  }

  private assignRole(role: string) {
    if (role === 'CLIENTE') this.roleCards = this.cardsCliente;
    else if (role === 'BIBLIOTECARIO') this.roleCards = this.cardsFuncionario;
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
