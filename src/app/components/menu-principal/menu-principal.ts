import { Component } from '@angular/core';
import { Menu } from '../cards/menu/menu';

@Component({
  selector: 'app-menu-principal',
  imports: [Menu],
  templateUrl: './menu-principal.html',
  styleUrl: './menu-principal.css'
})
export class MenuPrincipal {

  public role !: string
  public roleCards !: string[]

  public cardsCliente : string[] = ["Alterar dados cadastrais", "Consultar reservas"]
  public cardsFuncionario : string[] = ["Clientes", "Reservas", "Livros", "Autores", "Editoras", "Funcionários"]
  public cardsAdministrador : string[] = ["Clientes", "Reservas", "Livros", "Autores", "Editoras", "Funcionários", "Relatórios"]

  public assignRole(role:string){
    this.role = role

    if (role == "CLIENTE") {
      this.roleCards = this.cardsCliente
    } else if (role = "FUNCIONARIO") {
      this.roleCards = this.cardsFuncionario
    } else if (role = "ADMINISTRADOR") {
      this.roleCards = this.cardsAdministrador
    }
  }
}
