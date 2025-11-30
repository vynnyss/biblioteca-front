import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { EditoraModel } from '../../../../../models/editora-model';

@Component({
  selector: 'app-lista-editoras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-editoras.html',
  styleUrl: './lista-editoras.css'
})
export class ListaEditoras implements OnInit {
  public editoras: EditoraModel[] = [];
  private allEditoras: EditoraModel[] = [];
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
      this.allEditoras = [];
      this.editoras = [];
      return;
    }

    this.serv.getApiUrlGetEditoras(token, this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (response: any) => {
        this.allEditoras = response?.conteudo || [];
        this.totalPaginas = response.totalPaginas || 0;
        this.totalElementos = response.totalElementos || 0;
        this.availableStatuses = Array.from(new Set(this.allEditoras.map(e => e.statusAtivo))).filter(s => !!s);
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Erro ao carregar editoras:', err);
        this.allEditoras = [];
        this.editoras = [];
      }
    });
  }

  public applyFilters(): void {
    let items = this.allEditoras.slice();
    const nq = (this.nameQuery || '').trim().toLowerCase();
    if (this.statusFilter) {
      items = items.filter(e => (e.statusAtivo || '') === this.statusFilter);
    }
    if (nq) {
      items = items.filter(e => (e.nome || '').toLowerCase().indexOf(nq) !== -1);
    }
    this.editoras = items;
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public getId(editora: EditoraModel): number | null {
    if (!editora) return null;
    return editora.idEditora ?? null;
  }

  public getName(editora: EditoraModel): string {
    if (!editora) return '';
    return editora.nome ?? JSON.stringify(editora);
  }

  public getStatus(editora: EditoraModel): string {
    if (!editora) return '';
    return editora.statusAtivo ?? JSON.stringify(editora);
  }

  public iniciarEdicao(editora: EditoraModel): void {
    if (!editora?.idEditora) return;
    this.editandoId = editora.idEditora;
    this.novoNome = editora.nome || '';
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
    this.putService.atualizarNomeEditora(this.editandoId, this.novoNome.trim(), token).subscribe({
      next: () => {
        alert('Nome atualizado com sucesso!');
        this.editandoId = null;
        this.novoNome = '';
        // Recarregar lista
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao atualizar nome da editora:', err);
        alert('Erro ao atualizar nome da editora.');
      }
    });
  }

  public inativarEditora(editora: EditoraModel): void {
    if (!editora?.idEditora) return;
    const confirmar = confirm(`Deseja realmente inativar a editora "${editora.nome}"?`);
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    this.deleteService.inativarEditora(editora.idEditora, token).subscribe({
      next: () => {
        alert('Editora inativada com sucesso!');
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao inativar editora:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar editora.';
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