import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { Category } from '../../../../../models/category';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-categorias.html',
  styleUrl: './lista-categorias.css'
})
export class ListaCategorias implements OnInit {
  private svc = inject(GetServicos);
  private putService = inject(PutService);
  private deleteService = inject(DeleteService);
  private router = inject(Router);

  public categorias: Category[] = [];
  public loading = false;
  public error: string | null = null;
  public userRole: string = '';

  private allCategorias: Category[] = [];

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = ['ATIVO', 'INATIVO'];

  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 50;
  public totalPaginas: number = 0;
  public totalElementos: number = 0;

  // modal de edição
  public mostrarModalEdicao = false;
  public categoriaEditando: Category | null = null;
  public categoriaEditada = {
    nome: ''
  };

  ngOnInit(): void {
    this.loadUserRole();
    this.loadCategorias();
  }

  private loadUserRole(): void {
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string };
        this.userRole = decoded?.role ?? '';
      } else {
        this.userRole = '';
      }
    } catch (e) {
      console.error('Erro ao ler role do sessionStorage:', e);
      this.userRole = '';
    }
  }

  private loadCategorias(): void {
    this.loading = true;
    this.error = null;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.error = 'Token não encontrado. Faça login novamente.';
      this.loading = false;
      return;
    }

    this.svc.getApiUrlGetCategorias(token, this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (response: any) => {
        this.allCategorias = response?.conteudo || [];
        this.totalPaginas = response?.totalPaginas || 0;
        this.totalElementos = response?.totalElementos || 0;
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar categorias.';
        this.loading = false;
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  public applyFilters(): void {
    const nq = (this.nameQuery || '').trim().toLowerCase();
    const sf = (this.statusFilter || '').trim();

    let items = (this.allCategorias || []).slice();
    
    if (sf) {
      items = items.filter(c => c.statusAtivo === sf);
    }
    
    if (nq) {
      items = items.filter(c => c.nome?.toLowerCase().includes(nq));
    }

    this.categorias = items;
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public abrirModalEdicao(categoria: Category): void {
    this.categoriaEditando = categoria;
    this.categoriaEditada = {
      nome: categoria.nome
    };
    this.mostrarModalEdicao = true;
  }

  public fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.categoriaEditando = null;
    this.categoriaEditada = {
      nome: ''
    };
  }

  public salvarEdicao(): void {
    if (!this.categoriaEditando) {
      alert('Categoria não selecionada.');
      return;
    }

    const nome = this.categoriaEditada.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome da categoria.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    console.log('[ListaCategorias] Atualizando categoria:', this.categoriaEditando.idCategoria);
    
    this.putService.atualizarNomeCategoria(this.categoriaEditando.idCategoria, nome, token).subscribe({
      next: (response: any) => {
        console.log('[ListaCategorias] Categoria atualizada com sucesso:', response);
        alert('Categoria atualizada com sucesso!');
        this.fecharModalEdicao();
        this.loadCategorias();
      },
      error: (err) => {
        console.error('[ListaCategorias] Erro ao atualizar categoria:', err);
        const backend = err.error;
        let msg =
          typeof backend === 'string'
            ? backend
            : backend?.mensagem || backend?.message || JSON.stringify(backend);
        alert(msg);
      }
    });
  }

  public deletarCategoria(categoria: Category): void {
    const confirmar = confirm(`Deseja realmente inativar a categoria "${categoria.nome}"?`);
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    console.log('[ListaCategorias] Inativando categoria:', categoria.idCategoria);
    
    this.deleteService.inativarCategoria(categoria.idCategoria, token).subscribe({
      next: () => {
        console.log('[ListaCategorias] Categoria inativada com sucesso');
        alert('Categoria inativada com sucesso!');
        this.loadCategorias();
      },
      error: (err) => {
        console.error('[ListaCategorias] Erro ao inativar categoria:', err);
        const backend = err.error;
        let msg =
          typeof backend === 'string'
            ? backend
            : backend?.mensagem || backend?.message || JSON.stringify(backend);
        alert(msg);
      }
    });
  }

  public isAdministrador(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  // Pagination methods
  public irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaAtual = pagina;
      this.loadCategorias();
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.loadCategorias();
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.loadCategorias();
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
