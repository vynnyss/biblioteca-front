import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../cards/book/book';
import { GetServicos } from '../../servicos/api/get-servicos';
import { BookModel } from '../../models/book-model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Book],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewInit {
  public books: BookModel[] = [];
  private allBooks: BookModel[] = [];
  private debounceTimer: any = null;
  
  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 8;
  public totalPaginas: number = 0;
  public totalElementos: number = 0;
  private isSearchActive: boolean = false;
  private lastSearchTerm: string = '';

  constructor(private getServicos: GetServicos) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  ngAfterViewInit(): void {
    this.setupSearchListener();
    this.setupGenreFilterListener();
  }

  private carregarLivros(): void {
    this.getServicos.getApiUrlGetEdicoesAtivas(this.paginaAtual, this.tamanhoPagina).subscribe((response) => {
      console.log('Home: loaded books', response);
      this.books = response.conteudo || [];
      this.totalPaginas = response.totalPaginas || 0;
      this.totalElementos = response.totalElementos || 0;
      this.updateBooksCount();
    });
  }

  private carregarLivrosComPaginacao(pagina: number): void {
    this.paginaAtual = pagina;
    if (this.isSearchActive && this.lastSearchTerm) {
      this.buscarComPaginacao(this.lastSearchTerm, pagina);
    } else {
      this.carregarLivros();
    }
  }

  private setupSearchListener(): void {
    const input = document.querySelector('#search-input') as HTMLInputElement;
    if (!input) return;

    input.addEventListener('input', () => {
      const termo = input.value.trim();

      clearTimeout(this.debounceTimer);

      if (termo.length === 0) {
        this.isSearchActive = false;
        this.lastSearchTerm = '';
        this.paginaAtual = 0;
        this.carregarLivros();
        this.showClearButton(false);
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.isSearchActive = true;
        this.lastSearchTerm = termo;
        this.paginaAtual = 0;
        this.buscarComPaginacao(termo, 0);
        this.showClearButton(true);
      }, 300);
    });
  }

  private buscarComPaginacao(termo: string, pagina: number): void {
    this.getServicos.filtrarEdicoes(termo, pagina, this.tamanhoPagina).subscribe({
      next: (response) => {
        console.log('Home: search results for', termo, response);
        this.books = response.conteudo || [];
        this.totalPaginas = response.totalPaginas || 0;
        this.totalElementos = response.totalElementos || 0;
        this.updateBooksCount();
      },
      error: (err) => {
        console.error('Erro ao buscar:', err);
        this.books = [];
        this.totalPaginas = 0;
        this.totalElementos = 0;
        this.updateBooksCount();
      }
    });
  }

  private setupGenreFilterListener(): void {
    // Genre filtering disabled with pagination
    // Would need backend support for filtering by category
  }

  private updateBooksCount(): void {
    const countElement = document.querySelector('#books-count');
    if (countElement) {
      countElement.textContent = `${this.books.length} Livros encontrados`;
    }
  }

  private showClearButton(show: boolean): void {
    const clearBtn = document.querySelector('#clear-search');
    if (clearBtn) {
      if (show) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
  }

  public clearSearch(): void {
    const input = document.querySelector('#search-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
    this.isSearchActive = false;
    this.lastSearchTerm = '';
    this.paginaAtual = 0;
    this.carregarLivros();
    this.showClearButton(false);
  }

  // Pagination methods
  public irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.carregarLivrosComPaginacao(pagina);
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.carregarLivrosComPaginacao(this.paginaAtual - 1);
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.carregarLivrosComPaginacao(this.paginaAtual + 1);
    }
  }

  public getPaginasVisiveis(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);
    let inicio = Math.max(0, this.paginaAtual - metade);
    let fim = Math.min(this.totalPaginas, inicio + maxPaginas);
    
    if (fim - inicio < maxPaginas) {
      inicio = Math.max(0, fim - maxPaginas);
    }
    
    const paginas: number[] = [];
    for (let i = inicio; i < fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }
}
