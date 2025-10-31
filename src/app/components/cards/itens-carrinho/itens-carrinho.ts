import { Component, Input, inject } from '@angular/core';
import { BookModel } from '../../../models/book-model';
import { CartService } from '../../../servicos/utils/cart-service';

@Component({
  selector: 'app-itens-carrinho',
  imports: [],
  templateUrl: './itens-carrinho.html',
  styleUrl: './itens-carrinho.css'
})
export class ItensCarrinho {
  @Input() data!: BookModel
  private cartService = inject(CartService);

  getAuthor(): string {
    return this.data?.titulo?.autores?.[0]?.nome || 'Desconhecido';
  }
  getTitle(): string {
    return this.data?.titulo?.nome || '';
  }

  removerDoCarrinho(): void {
    try {
      const key = 'cartBooks';
      const raw = sessionStorage.getItem(key);
      const cartBooks = raw ? JSON.parse(raw) as BookModel[] : [];
      const index = cartBooks.findIndex(item => item.idEdicao === this.data.idEdicao);
      if (index !== -1) {
        cartBooks.splice(index, 1);
        sessionStorage.setItem(key, JSON.stringify(cartBooks));
        console.log("Livro removido do carrinho com sucesso!");
        // notificar outros componentes (ex: Carrinho) para recarregarem os dados
        try {
          this.cartService.notifyCartChanged();
        } catch (e) {
          console.error('Erro ao notificar mudança do carrinho:', e);
        }
      }
    } catch (e) {
      console.error('Erro ao remover livro do carrinho:', e);
    }
    // Não recarregamos toda a página; o Carrinho escuta notifyCartChanged para atualizar
  }
}
