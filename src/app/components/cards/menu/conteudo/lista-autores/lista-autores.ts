import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { AutorModel } from '../../../../../models/autor';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-autores.html',
  styleUrl: './lista-autores.css'
})
export class ListaAutores implements OnInit {
  public autores: AutorModel[] = [];
  private allAutores: AutorModel[] = [];
  public userRole: string = '';

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 50;
  public totalPaginas: number = 0;
  public totalElementos: number = 0;

  // edição
  public editandoId: number | null = null;
  public novoNome: string = '';

  constructor(
    private serv: GetServicos, 
    private putService: PutService,
    private deleteService: DeleteService
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.allAutores = [];
      this.autores = [];
      return;
    }

    this.serv.getApiUrlGetAutores(token, this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (response: any) => {
        this.allAutores = response?.conteudo || [];
        this.totalPaginas = response.totalPaginas || 0;
        this.totalElementos = response.totalElementos || 0;
        this.availableStatuses = Array.from(new Set(this.allAutores.map(a => a.statusAtivo))).filter(s => !!s);
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Erro ao carregar autores:', err);
        this.allAutores = [];
        this.autores = [];
      }
    });
  }

  public applyFilters(): void {
    let items = this.allAutores.slice();
    const nq = (this.nameQuery || '').trim().toLowerCase();
    if (this.statusFilter) {
      items = items.filter(a => (a.statusAtivo || '') === this.statusFilter);
    }
    if (nq) {
      items = items.filter(a => (a.nome || '').toLowerCase().indexOf(nq) !== -1);
    }
    this.autores = items;
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public getId(autor: AutorModel): number | null {
    if (!autor) return null;
    return autor.idAutor ?? null;
  }

  public getName(autor: AutorModel): string {
    if (!autor) return '';
    return autor.nome ?? JSON.stringify(autor);
  }

  public getStatus(autor: AutorModel): string {
    if (!autor) return '';
    return autor.statusAtivo ?? JSON.stringify(autor);
  }

  public iniciarEdicao(autor: AutorModel): void {
    if (!autor?.idAutor) return;
    this.editandoId = autor.idAutor;
    this.novoNome = autor.nome || '';
  }

  public cancelarEdicao(): void {
    this.editandoId = null;
    this.novoNome = '';
  }

  public salvarEdicao(): void {
    if (!this.editandoId || !this.novoNome.trim()) {
      alert('Nome não pode estar vazio.');
      return;
    }
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.putService.atualizarNomeAutor(this.editandoId, this.novoNome.trim(), token).subscribe({
      next: () => {
        alert('Nome atualizado com sucesso!');
        this.editandoId = null;
        this.novoNome = '';
        // Recarregar lista
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao atualizar nome do autor:', err);
        alert('Erro ao atualizar nome do autor.');
      }
    });
  }

  public inativarAutor(autor: AutorModel): void {
    if (!autor?.idAutor) return;
    const confirmar = confirm(`Deseja realmente inativar o autor "${autor.nome}"?`);
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    this.deleteService.inativarAutor(autor.idAutor, token).subscribe({
      next: () => {
        alert('Autor inativado com sucesso!');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao inativar autor:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar autor.';
        alert(msg);
      }
    });
  }

  private loadUserRole(): void {
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string };
        this.userRole = decoded?.role ?? '';
      }
    } catch (e) {
      console.error('Erro ao ler decodedToken:', e);
      this.userRole = '';
    }
  }

  public isAdministrador(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  // Pagination methods
  public irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaAtual = pagina;
      this.ngOnInit();
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.ngOnInit();
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.ngOnInit();
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
