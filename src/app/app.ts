import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Funcionario } from './components/cadastro/funcionario/funcionario';
import { Pessoa } from './components/cadastro/pessoa/pessoa';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Funcionario,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('biblioteca-front');
}
