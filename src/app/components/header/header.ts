import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, inject, Input, Output, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../modal/login/login';
import { Registro } from '../modal/registro/registro';
import { LoginResponse } from '../../models/login-response';
import { CartService } from '../../servicos/utils/cart-service';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  
  cartCount: number = 0;
  isClient: boolean = false;
  private dialog = inject(Dialog)
  private cartService = inject(CartService)

  @Input() isLogged: boolean = false

  @Output() respostaLogin = new EventEmitter<LoginResponse>();
  @Output() emitirLogout = new EventEmitter();

  openModalLogin(){

     const dialogRef = this.dialog.open<LoginResponse>(Login)

     dialogRef.closed.subscribe(result =>{
      if (result) {
        this.respostaLogin.emit(result)
     }
  })
  }
  openModalRegistro(){
    this.dialog.open(Registro)
  }

  ngOnInit(): void {
    // inicializa contador a partir do sessionStorage
    this.loadCartCount();
    // inicializa role a partir do decodedToken no sessionStorage
    this.loadDecodedTokenRole();

    console.log('Header: subscribing to cartService events');
    this.cartService.added$.subscribe(() => {
      console.log('Header: received cart added event');
      // recarrega o contador e anima o badge
      this.loadCartCount();
      this.triggerCartPulse();
    });

    // escuta mudanças no conteúdo do carrinho (remoções/atualizações)
    this.cartService.changed$.subscribe(() => {
      console.log('Header: received cart changed event');
      this.loadCartCount();
    });

    // atualiza contador caso outra aba/janela modifique o sessionStorage
    window.addEventListener('storage', (ev) => {
      if (ev.key === 'cartBooks') {
        console.log('Header: storage event for cartBooks detected');
        this.loadCartCount();
      }
    });

    // escuta evento customizado para mudanças de autenticação na mesma aba
    window.addEventListener('auth:changed', () => {
      this.loadDecodedTokenRole();
    });
  }

  private loadCartCount(): void {
    try {
      const raw = sessionStorage.getItem('cartBooks');
      const arr = raw ? JSON.parse(raw) : [];
      this.cartCount = Array.isArray(arr) ? arr.length : 0;
    } catch (e) {
      console.error('Header: erro ao ler cartBooks do sessionStorage', e);
      this.cartCount = 0;
    }
  }

  private loadDecodedTokenRole(): void {
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (!raw) {
        this.isClient = false;
        return;
      }
      const decoded = JSON.parse(raw) as { role?: string };
      this.isClient = decoded?.role === 'CLIENTE';
    } catch (e) {
      console.error('Header: erro ao ler decodedToken do sessionStorage', e);
      this.isClient = false;
    }
  }

  realizarLogout(){
    this.emitirLogout.emit()
  }

  triggerCartPulse() {
    const badge = document.querySelector<HTMLElement>('.cart-count');
    if (!badge) return;

    badge.classList.remove('pulse');
    void badge.offsetWidth; // força o reflow para reiniciar a animação
    badge.classList.add('pulse');
  }

  adicionarAoCarrinho() {
    this.cartCount++;
    this.triggerCartPulse();
  }
}
