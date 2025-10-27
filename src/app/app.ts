import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { LoginResponse } from './models/login-response';
import { Autor } from './components/cadastro/autor/autor';
import { Editora } from './components/cadastro/editora/editora';
import { Genero } from './components/cadastro/genero/genero';
import { Idioma } from './components/cadastro/idioma/idioma';
import { Pais } from './components/cadastro/pais/pais';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Funcionario, Autor, Idioma, Editora, Genero, Pais],
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
