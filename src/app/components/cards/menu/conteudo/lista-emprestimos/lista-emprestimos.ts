import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { ListaEmprestimoModel } from '../../../../../models/lista-emprestimo-model';
import { DetalhesEmprestimos } from '../detalhes-emprestimos/detalhes-emprestimos';
import { AuthHelper } from '../../../../../servicos/utils/auth-helper';

@Component({
  selector: 'app-lista-emprestimos',
  standalone: true,
  imports: [CommonModule, FormsModule, DetalhesEmprestimos],
  templateUrl: './lista-emprestimos.html',
  styleUrl: './lista-emprestimos.css'
})
export class ListaEmprestimos implements OnInit {
  public emprestimos: ListaEmprestimoModel[] = [];
  private allEmprestimos: ListaEmprestimoModel[] = [];
  public loading = false;
  public error: string | null = null;

  public selectedId: number | null = null;

  // filters
  public selectedStatus: string = '';
  public multaFilter: 'all' | 'with' | 'without' = 'all';
  public pessoaQuery: string = '';
  public availableStatuses: string[] = [];

  private userRole: string = '';
  private userIdPessoa: number | null = null;
  private userEmail: string = '';

  public isCliente(): boolean {
    return this.userRole === 'CLIENTE';
  }

  constructor(private serv: GetServicos) {}

  ngOnInit(): void {
    // Verifica a role do usuário
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string; idPessoa?: number; email?: string; sub?: string };
        this.userRole = decoded?.role ?? '';
        this.userIdPessoa = decoded?.idPessoa ?? null;
        this.userEmail = decoded?.email ?? decoded?.sub ?? sessionStorage.getItem('username') ?? '';
      }
    } catch (e) {
      console.error('Erro ao ler decodedToken:', e);
    }

    this.load();
  }

  private load() {
    this.loading = true;
    this.error = null;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    // Se for CLIENTE, busca empréstimos por email com paginação
    if (this.userRole === 'CLIENTE' && this.userEmail) {
      this.serv.getEmprestimosPorEmail(this.userEmail, token, 0, 50).subscribe({
        next: (response: any) => {
          // Resposta paginada do backend
          this.allEmprestimos = response.conteudo || [];
          this.availableStatuses = Array.from(new Set(this.allEmprestimos.map(x => x.status))).filter(s => !!s);
          this.applyFilters();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erro ao carregar emprestimos do cliente:', err);
          if (AuthHelper.checkAndHandleExpiredToken(err)) return;
          this.error = 'Erro ao carregar empréstimos.';
          this.loading = false;
        }
      });
    } else {
      // Se não for CLIENTE, busca todos os empréstimos
      this.serv.getApiUrlGetEmprestimos(token, 0, 1000).subscribe({
        next: (response: any) => {
          this.allEmprestimos = response?.conteudo || [];
          this.availableStatuses = Array.from(new Set(this.allEmprestimos.map(x => x.status))).filter(s => !!s);
          this.applyFilters();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erro ao carregar emprestimos:', err);
          if (AuthHelper.checkAndHandleExpiredToken(err)) return;
          this.error = 'Erro ao carregar empréstimos.';
          this.loading = false;
        }
      });
    }
  }

  public showDetails(id: number) {
    this.selectedId = id;
  }

  public clearDetails() {
    this.selectedId = null;
    this.load(); // Recarrega a lista de empréstimos
  }

  public applyFilters() {
    let items = this.allEmprestimos.slice();

    // status filter
    if (this.selectedStatus) {
      items = items.filter(i => i.status === this.selectedStatus);
    }

    // multa filter
    if (this.multaFilter === 'with') {
      items = items.filter(i => i.multa && (i.multa.valor || 0) > 0);
    } else if (this.multaFilter === 'without') {
      items = items.filter(i => !(i.multa && (i.multa.valor || 0) > 0));
    }

    // pessoa query: match idPessoa as string (exact)
    const q = (this.pessoaQuery || '').trim().toLowerCase();
    if (q) {
      items = items.filter(i => String(i.idPessoa).toLowerCase() === q);
    }

    this.emprestimos = items;
  }

  public clearFilters() {
    this.selectedStatus = '';
    this.multaFilter = 'all';
    this.pessoaQuery = '';
    this.applyFilters();
  }
}
