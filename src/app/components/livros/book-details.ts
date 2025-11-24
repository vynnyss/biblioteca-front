import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { BookModel } from '../../models/book-model';
import { CartService } from '../../servicos/utils/cart-service';
import { Login } from '../modal/login/login';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {

  private cartService = inject(CartService);
  private dialog = inject(Dialog);
  private router = inject(Router);

  public livro!: BookModel;
  public showAuthModal: boolean = false;

  ngOnInit(): void {
      this.livro = history.state
  }
  addToCart(): void {
    // Verifica se está logado
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.showAuthModal = true;
      return;
    }

    // Verifica se é cliente
    try {
      const decodedRaw = sessionStorage.getItem('decodedToken');
      const decoded = decodedRaw ? JSON.parse(decodedRaw) as { role?: string } : null;
      if (!decoded || decoded.role !== 'CLIENTE') {
        alert('❌ Apenas usuários com perfil CLIENTE podem adicionar livros ao carrinho.');
        return;
      }
    } catch (e) {
      console.error('Erro ao ler decodedToken do sessionStorage:', e);
      alert('❌ Não foi possível verificar permissão para adicionar ao carrinho.');
      return;
    }

    // salva o livro atual no sessionStorage (mantém um array de livros)
    try {
      const key = 'cartBooks';
      const raw = sessionStorage.getItem(key);
      const current: BookModel[] = raw ? JSON.parse(raw) : [];
      
      // Verifica se o livro já está no carrinho
      const jaExiste = current.some(item => item.idEdicao === this.livro.idEdicao);
      if (jaExiste) {
        alert('ℹ️ Este livro já está no seu carrinho!');
        return;
      }
      
      current.push(this.livro);
      sessionStorage.setItem(key, JSON.stringify(current));
      
      // Notifica o header para atualizar o contador/pulse
      this.cartService.addToCart();
      
      // Feedback visual de sucesso
      alert('✅ Livro adicionado ao carrinho com sucesso!');
    } catch (e) {
      console.error('Erro ao salvar livro no sessionStorage:', e);
      alert('❌ Erro ao adicionar livro ao carrinho. Tente novamente.');
    }
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

  closeAuthModal(): void {
    this.showAuthModal = false;
  }

  openLoginModal(): void {
    this.showAuthModal = false;
    const dialogRef = this.dialog.open<LoginResponse>(Login);
    
    dialogRef.closed.subscribe(result => {
      if (result && result.token) {
        try {
          // Login bem-sucedido, salva token
          sessionStorage.setItem('authToken', result.token);
          
          // Decodifica o token para obter o role
          const payload = JSON.parse(atob(result.token.split('.')[1]));
          sessionStorage.setItem('decodedToken', JSON.stringify(payload));
          
          // Salva o ID do usuário se disponível
          if (result.id) {
            sessionStorage.setItem('userId', String(result.id));
          }
          
          // Dispara evento para atualizar header
          window.dispatchEvent(new Event('auth:changed'));
          
          // Feedback visual
          alert('✅ Login realizado com sucesso!');
          
          // Recarrega a página para atualizar o header completamente
          window.location.reload();
        } catch (e) {
          console.error('Erro ao processar login:', e);
          alert('❌ Erro ao processar login. Tente novamente.');
        }
      }
    });
  }

  goToCadastro(): void {
    this.showAuthModal = false;
    this.router.navigate(['/cadastro/pessoa']);
  }
}
