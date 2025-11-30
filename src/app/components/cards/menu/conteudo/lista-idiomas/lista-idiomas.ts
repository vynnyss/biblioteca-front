import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';

@Component({
  selector: 'app-lista-idiomas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-idiomas.html',
  styleUrl: './lista-idiomas.css'
})
export class ListaIdiomas implements OnInit {
  public idiomas: any[] = [];
  private allIdiomas: any[] = [];
  public userRole: string = '';

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 10;
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
      this.allIdiomas = [];
      this.idiomas = [];
      return;
    }

    this.serv.getApiUrlGetIdiomas(token).subscribe({
      next: (list: any[]) => {
        this.allIdiomas = list || [];
        this.totalElementos = this.allIdiomas.length;
        this.totalPaginas = Math.ceil(this.totalElementos / this.tamanhoPagina);
        this.availableStatuses = Array.from(new Set(this.allIdiomas.map(i => i.statusAtivo))).filter(s => !!s);
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Erro ao carregar idiomas:', err);
        this.allIdiomas = [];
        this.idiomas = [];
      }
    });
  }

  public applyFilters(): void {
    let items = this.allIdiomas.slice();
    const nq = (this.nameQuery || '').trim().toLowerCase();
    if (this.statusFilter) {
      items = items.filter(i => (i.statusAtivo || '') === this.statusFilter);
    }
    if (nq) {
      items = items.filter(i => (i.nome || '').toLowerCase().indexOf(nq) !== -1);
    }
    // Client-side pagination
    const inicio = this.paginaAtual * this.tamanhoPagina;
    const fim = inicio + this.tamanhoPagina;
    this.idiomas = items.slice(inicio, fim);
    this.totalElementos = items.length;
    this.totalPaginas = Math.ceil(this.totalElementos / this.tamanhoPagina);
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public getId(idioma: any): number | null {
    if (!idioma) return null;
    return idioma.idIdioma ?? null;
  }

  public getName(idioma: any): string {
    if (!idioma) return '';
    return idioma.nome ?? JSON.stringify(idioma);
  }

  public getStatus(idioma: any): string {
    if (!idioma) return '';
    return idioma.statusAtivo ?? JSON.stringify(idioma);
  }

  public iniciarEdicao(idioma: any): void {
    if (!idioma?.idIdioma) return;
    this.editandoId = idioma.idIdioma;
    this.novoNome = idioma.nome || '';
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
    this.putService.atualizarNomeIdioma(this.editandoId, this.novoNome.trim(), token).subscribe({
      next: () => {
        alert('Nome atualizado com sucesso!');
        this.editandoId = null;
        this.novoNome = '';
        // Recarregar lista
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error('Erro ao atualizar nome do idioma:', err);
        alert('Erro ao atualizar nome do idioma.');
      }
    });
  }

  public inativarIdioma(idioma: any): void {
    if (!idioma?.idIdioma) return;
    const confirmar = confirm(`Deseja realmente inativar o idioma "${idioma.nome}"?`);
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    this.deleteService.inativarIdioma(idioma.idIdioma, token).subscribe({
      next: () => {
        alert('Idioma inativado com sucesso!');
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error('Erro ao inativar idioma:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar idioma.';
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
      this.applyFilters();
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.applyFilters();
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.applyFilters();
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
