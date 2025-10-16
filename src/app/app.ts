import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { LoginResponse } from './models/login-response';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Funcionario,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('biblioteca-front');

  private token!: string
  private logado: boolean = false

  setToken(event: LoginResponse){
    this.token = event.token
    this.logado = true
    this.logarToken()
  }

  logarToken(){
    console.log("Usuário logado", this.token)
  }

  getLogado(){
    return this.logado
  }

  realizarLogout(){
    this.token = ""
    this.logado = false
    console.log("usuário deslogado", this.logado, this.token)
  }
}
