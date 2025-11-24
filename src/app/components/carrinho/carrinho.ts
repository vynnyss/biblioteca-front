import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);

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
      alert('❌ Erro: não foi possível identificar o usuário. Faça login novamente.');
      return;
    }

    if (this.mockBooks.length === 0) {
      alert('ℹ️ Seu carrinho está vazio. Adicione livros antes de finalizar o pedido.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('❌ Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    this.getServicos.getPessoaPorEmail(email, token).subscribe({
      next: (p) => {
        const emprestimo: Emprestimo = {
          idPessoa: p.idPessoa,
          idsEdicao: this.mockBooks.map(b => (b as any).idEdicao).filter(Boolean) as number[]
        };
        console.log('Objeto Emprestimo criado:', emprestimo);
        this.postService.postEmprestimo(emprestimo, token).subscribe({
          next: (response) => {
            console.log('Empréstimo realizado com sucesso:', response);
            alert('✅ Pedido finalizado com sucesso! Seus livros foram reservados.');
            this.clearSessionCart();
          },
          error: (err) => {
            console.error('Erro ao realizar empréstimo:', err);
            const errorMsg = err?.error?.mensagem || err?.message || 'Erro ao processar o empréstimo';
            alert(`❌ Erro ao finalizar pedido: ${errorMsg}`);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao buscar pessoa para finalizar pedido:', err);
        alert('❌ Erro ao buscar dados do usuário. Tente novamente ou faça login novamente.');
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

  private clearSessionCart(): void {
    try {
      const key = 'cartBooks';
      sessionStorage.removeItem(key);
      console.log("carrinho limpo do storage com sucesso!")
      this.cartService.notifyCartChanged();
      this.router.navigate(['/menu-principal'], { state: { selectedCard: 'Emprestimos' } });
    } catch (e) {
      console.error('Erro ao limpar carrinho do sessionStorage:', e);
    }
  }
}
