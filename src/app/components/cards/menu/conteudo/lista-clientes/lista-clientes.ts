import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PessoaModel } from '../../../../../models/pessoa-model';
import { DetalhesCliente } from '../detalhes-cliente/detalhes-cliente';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, DetalhesCliente],
  templateUrl: './lista-clientes.html',
  styleUrls: ['./lista-clientes.css']
})
export class ListaClientes implements OnInit {
  public clientes: PessoaModel[] = [];
  private allClientes: PessoaModel[] = [];
  public loading = false;
  public error: string | null = null;

  // filters
  public nameQuery: string = '';
  public emailQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];
  public selectedCliente: PessoaModel | null = null;

  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 50;
  public totalPaginas: number = 0;
  public totalElementos: number = 0;

  constructor(private svc: GetServicos) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  private loadClientes(): void {
    this.loading = true;
    this.error = null;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    this.svc.getApiUrlGetClientes(token, this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (response: any) => {
        this.allClientes = response?.conteudo || [];
        this.totalPaginas = response.totalPaginas || 0;
        this.totalElementos = response.totalElementos || 0;
        this.availableStatuses = ['INATIVA','REJEITADA','EM_ANALISE_APROVACAO','EM_ANALISE_EXCLUSAO','ATIVA'];
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('ListaClientes: erro ao carregar clientes', err);
        this.error = 'Erro ao carregar a lista de clientes.';
        this.loading = false;
      }
    });
  }

  public applyFilters(): void {
    let items = this.allClientes.slice();
    const nq = (this.nameQuery || '').trim().toLowerCase();
    const eq = (this.emailQuery || '').trim().toLowerCase();

    if (this.statusFilter) {
      items = items.filter(c => c.statusConta === this.statusFilter);
    }

    if (nq) {
      items = items.filter(c => (c.nome || '').toLowerCase().indexOf(nq) !== -1);
    }

    if (eq) {
      items = items.filter(c => ((c.email && c.email.endereco) || c.username || '').toLowerCase().indexOf(eq) !== -1);
    }

    this.clientes = items;
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.emailQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public showDetails(c: PessoaModel) {
    this.selectedCliente = c;
  }

  public clearDetails() {
    this.selectedCliente = null;
  }

  // Pagination methods
  public irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaAtual = pagina;
      this.loadClientes();
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.loadClientes();
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.loadClientes();
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
