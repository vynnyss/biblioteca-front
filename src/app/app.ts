import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { LoginResponse } from './models/login-response';
import { Carrinho } from './components/carrinho/carrinho';
import { BookDetails } from "./components/livros/book-details";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Carrinho, BookDetails],
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
