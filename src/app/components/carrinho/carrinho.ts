import { Component, OnInit, inject } from '@angular/core';
import { ItensCarrinho } from '../cards/itens-carrinho/itens-carrinho';
import { BookModel } from '../../models/bookI-model';
import { CartService } from '../../servicos/utils/cart-service';

@Component({
  selector: 'app-carrinho',
  imports: [ItensCarrinho],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho implements OnInit {
  public mockBooks: BookModel[] = [];
  public quantidadeLivros = 0;
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.loadFromSession();
    // escuta mudanças do cart para atualizar a lista sem recarregar a página
    this.cartService.changed$.subscribe(() => this.loadFromSession());
  }

  private loadFromSession(): void {
    try {
      const key = 'cartBooks';
      const raw = sessionStorage.getItem(key);
      this.mockBooks = raw ? JSON.parse(raw) as BookModel[] : [];
      console.log("carrinho carregado do storage com sucesso!")
      console.log(this.mockBooks);
    } catch (e) {
      console.error('Erro ao carregar carrinho do sessionStorage:', e);
      this.mockBooks = [];
    }
    this.quantidadeLivros = this.mockBooks.length;
  }

}
