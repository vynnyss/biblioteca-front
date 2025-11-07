import { Component, OnInit, inject } from '@angular/core';
import { BookModel } from '../../models/book-model';
import { CartService } from '../../servicos/utils/cart-service';

@Component({
  selector: 'app-book-details',
  imports: [],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  private cartService = inject(CartService);

  public livro!: BookModel;

  ngOnInit(): void {
      this.livro = history.state
  }
  addToCart(): void {
    // só clientes podem adicionar ao carrinho
    try {
      const decodedRaw = sessionStorage.getItem('decodedToken');
      const decoded = decodedRaw ? JSON.parse(decodedRaw) as { role?: string } : null;
      if (!decoded || decoded.role !== 'CLIENTE') {
        alert('Apenas usuários com perfil CLIENTE podem adicionar livros ao carrinho.');
        return;
      }
    } catch (e) {
      console.error('Erro ao ler decodedToken do sessionStorage:', e);
      alert('Não foi possível verificar permissão para adicionar ao carrinho.');
      return;
    }

    // salva o livro atual no sessionStorage (mantém um array de livros)
    try {
      const key = 'cartBooks';
      const raw = sessionStorage.getItem(key);
      const current: BookModel[] = raw ? JSON.parse(raw) : [];
      current.push(this.livro);
      sessionStorage.setItem(key, JSON.stringify(current));
    } catch (e) {
      console.error('Erro ao salvar livro no sessionStorage:', e);
    }
    // notifica o header para atualizar o contador/pulse
    this.cartService.addToCart();
  }

  getAuthor(): string {
    return this.livro?.titulo?.autores?.[0]?.nome || 'Desconhecido';
  }

  getYear(): string {
    return this.livro?.dtPublicacao ? this.livro.dtPublicacao.slice(0,4) : '';
  }

  getCategories(): string {
    return this.livro?.titulo?.categorias?.map(c => c.nome).join(', ') || '';
  }
}
