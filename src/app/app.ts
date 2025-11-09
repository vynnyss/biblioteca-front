import { Component, signal, OnInit, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { LoginResponse } from './models/login-response';
import { DecodeToken } from './models/decode-token';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly title = signal('biblioteca-front');
  private token!: string
  private logado: boolean = false
  private decodedToken: DecodeToken | null = null

  private readonly S_KEY_TOKEN = 'authToken';
  private readonly S_KEY_LOGADO = 'isLogged';
  private readonly S_KEY_DECODED = 'decodedToken';

  ngOnInit(): void {
    try {
      const token = sessionStorage.getItem(this.S_KEY_TOKEN);
      const isLogged = sessionStorage.getItem(this.S_KEY_LOGADO);
      const decodedRaw = sessionStorage.getItem(this.S_KEY_DECODED);

      if (token) {
        this.token = token;
        this.logado = isLogged ? JSON.parse(isLogged) : true;
        if (decodedRaw) {
          try {
            this.decodedToken = JSON.parse(decodedRaw) as DecodeToken;
          } catch (e) {
            try {
              this.decodedToken = jwtDecode(this.token) as DecodeToken;
            } catch (err) {
              console.error('Erro ao decodificar token no ngOnInit:', err);
              this.decodedToken = null;
            }
          }
        } else {
          try {
            this.decodedToken = jwtDecode(this.token) as DecodeToken;
          } catch (e) {
            console.error('Erro ao decodificar token no ngOnInit:', e);
            this.decodedToken = null;
          }
        }
      }
    } catch (e) {
      console.error('Erro ao carregar estado de sessão:', e);
    }
  }

  setToken(event: LoginResponse){
    this.token = event.token
    this.logado = true
    try {
      this.decodedToken = jwtDecode(this.token) as DecodeToken;
      console.log(this.decodedToken.role)
    } catch (e) {
      console.error('Erro ao decodificar token:', e);
      this.decodedToken = null;
    }
    try {
      sessionStorage.setItem(this.S_KEY_TOKEN, this.token);
      sessionStorage.setItem(this.S_KEY_LOGADO, JSON.stringify(this.logado));
      sessionStorage.setItem(this.S_KEY_DECODED, JSON.stringify(this.decodedToken));
      
      if (event.id) {
        sessionStorage.setItem('userId', String(event.id));
        console.log('[App] userId salvo no sessionStorage:', event.id);
      } else {
        console.warn('[App] Backend não retornou userId no login. Tela de atualização pode falhar.');
      }
      
      try {
        window.dispatchEvent(new CustomEvent('auth:changed'));
      } catch (e) {
        console.warn('Não foi possível disparar evento auth:changed', e);
      }
    } catch (e) {
      console.error('Erro ao salvar estado no sessionStorage:', e);
    }
  }

  getLogado(){
    return this.logado
  }

  realizarLogout(){
    this.token = ""
    this.logado = false
    try {
      sessionStorage.clear();
      window.location.href = '/';
    } catch (e) {
      console.error('Erro ao remover estado do sessionStorage:', e);
    }
    try {
        window.dispatchEvent(new CustomEvent('auth:changed'));
      } catch (e) {
        console.warn('Não foi possível disparar evento auth:changed', e);
      }
  }
}
