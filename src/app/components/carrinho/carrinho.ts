import { Component, OnInit, inject } from '@angular/core';
import { ItensCarrinho } from '../cards/itens-carrinho/itens-carrinho';
import { BookModel } from '../../models/book-model';
import { CartService } from '../../servicos/utils/cart-service';
import { GetServicos } from '../../servicos/api/get-servicos';
import { Emprestimo } from '../../models/emprestimo';
import { PostService } from '../../servicos/api/post-service';

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
  private getServicos = inject(GetServicos);
  private postService = inject(PostService);

  ngOnInit(): void {
    this.loadFromSession();
    this.cartService.changed$.subscribe(() => this.loadFromSession());
  }

  public finalizarPedido(): void {
    let email: string | undefined;
    const username = sessionStorage.getItem('username');
    if (username) email = username;
    else {
      try {
        const raw = sessionStorage.getItem('decodedToken');
        if (raw) {
          const decoded = JSON.parse(raw) as any;
          email = decoded?.email ?? decoded?.sub ?? undefined;
        }
      } catch (e) {
        console.warn('Carrinho: erro ao ler decodedToken', e);
      }
    }

    if (!email) {
      console.warn('email do usuário não encontrado. Não foi possível finalizar pedido.');
      return;
    }

    this.getServicos.getPessoaPorEmail(email).subscribe({
      next: (p) => {
        const emprestimo: Emprestimo = {
          idPessoa: p.idPessoa,
          idsEdicao: this.mockBooks.map(b => (b as any).idEdicao).filter(Boolean) as number[]
        };
        console.log('Objeto Emprestimo criado:', emprestimo);
        this.postService.postEmprestimo(emprestimo).subscribe({
          next: (response) => {
            console.log('Empréstimo realizado com sucesso:', response);
          },
          error: (err) => {
            console.error('Erro ao realizar empréstimo:', err);
          }
        });
        /*
        // apagar o carrinho após finalizar
        try {
          sessionStorage.removeItem('cartBooks');
          this.loadFromSession();
          this.cartService.notifyCartChanged();
        } catch (e) {
          console.error('Erro ao limpar carrinho após finalizar pedido:', e);
        }
        // mandar para pagina inicial
        window.location.href = '/';
        */
      },
      error: (err) => {
        console.error('Erro ao buscar pessoa para finalizar pedido:', err);
      }
    });
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
