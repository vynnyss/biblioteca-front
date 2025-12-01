import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { PessoaModel } from '../../../../../models/pessoa-model';
import { DecodeToken } from '../../../../../models/decode-token';

@Component({
  selector: 'app-lista-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-funcionarios.html',
  styleUrls: ['./lista-funcionarios.css']
})
export class ListaFuncionarios implements OnInit {
  public administradores: PessoaModel[] = [];
  public funcionarios: PessoaModel[] = [];
  public loadingAdmins = false;
  public loadingFuncs = false;
  public error: string | null = null;

  private allAdministradores: PessoaModel[] = [];
  private allFuncionarios: PessoaModel[] = [];

  // filters
  public nameQuery: string = '';
  public emailQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

  // Pagination state for administradores
  public paginaAtualAdmins: number = 0;
  public tamanhoPaginaAdmins: number = 10;
  public totalPaginasAdmins: number = 0;
  public totalElementosAdmins: number = 0;

  // Pagination state for funcionarios
  public paginaAtualFuncs: number = 0;
  public tamanhoPaginaFuncs: number = 10;
  public totalPaginasFuncs: number = 0;
  public totalElementosFuncs: number = 0;

  // Modal inativar
  public mostrarModalInativar: boolean = false;
  public funcionarioInativando: PessoaModel | null = null;
  public motivoInativacao: string = '';

  constructor(
    private svc: GetServicos, 
    private router: Router,
    private deleteService: DeleteService
  ) {}

  ngOnInit(): void {
    this.loadAdministradores();
    this.loadFuncionarios();
  }

  private loadAdministradores(): void {
    this.loadingAdmins = true;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loadingAdmins = false;
      return;
    }

    this.svc.getApiUrlGetAdministradores(token, this.paginaAtualAdmins, this.tamanhoPaginaAdmins).subscribe({
      next: (response: any) => {
        this.allAdministradores = response?.conteudo || [];
        this.totalPaginasAdmins = response.totalPaginas || 0;
        this.totalElementosAdmins = response.totalElementos || 0;
        this.updateAvailableStatuses();
        this.applyFilters();
        this.loadingAdmins = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar administradores', err);
        this.error = 'Erro ao carregar administradores.';
        this.loadingAdmins = false;
      }
    });
  }

  private loadFuncionarios(): void {
    this.loadingFuncs = true;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loadingFuncs = false;
      return;
    }

    this.svc.getApiUrlGetFuncionarios(token, this.paginaAtualFuncs, this.tamanhoPaginaFuncs).subscribe({
      next: (response: any) => {
        this.allFuncionarios = response?.conteudo || [];
        this.totalPaginasFuncs = response.totalPaginas || 0;
        this.totalElementosFuncs = response.totalElementos || 0;
        this.updateAvailableStatuses();
        this.applyFilters();
        this.loadingFuncs = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar funcionários', err);
        this.error = 'Erro ao carregar funcionários.';
        this.loadingFuncs = false;
      }
    });
  }

  private updateAvailableStatuses(): void {
    const combined = (this.allAdministradores || []).concat(this.allFuncionarios || []);
    this.availableStatuses = Array.from(new Set(combined.map(c => c.statusConta))).filter(s => !!s);
  }

  public applyFilters(): void {
    const nq = (this.nameQuery || '').trim().toLowerCase();
    const eq = (this.emailQuery || '').trim().toLowerCase();
    const sf = (this.statusFilter || '').trim();

    const filterList = (list: PessoaModel[]) => {
      let items = (list || []).slice();
      if (sf) {
        items = items.filter(i => (i.statusConta || '') === sf);
      }
      if (nq) {
        items = items.filter(i => (i.nome || '').toLowerCase().indexOf(nq) !== -1);
      }
      if (eq) {
        items = items.filter(i => (((i.email && i.email.endereco) || i.username) || '').toLowerCase().indexOf(eq) !== -1);
      }
      return items;
    };

    this.administradores = filterList(this.allAdministradores);
    this.funcionarios = filterList(this.allFuncionarios);
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.emailQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public cadastrarNovoFuncionario(): void {
    this.router.navigate(['/cadastro/funcionario']);
  }

  public isAdministrador(): boolean {
    const raw = sessionStorage.getItem('decodedToken');
    if (!raw) return false;
    try {
      const decoded: DecodeToken = JSON.parse(raw);
      return decoded.role === 'ADMINISTRADOR';
    } catch {
      return false;
    }
  }

  public editarFuncionario(idPessoa: number): void {
    sessionStorage.setItem('userId', String(idPessoa));
    this.router.navigate(['/atualizacao/funcionario']);
  }

  public abrirModalInativar(funcionario: PessoaModel): void {
    this.funcionarioInativando = funcionario;
    this.motivoInativacao = '';
    this.mostrarModalInativar = true;
  }

  public fecharModalInativar(): void {
    this.mostrarModalInativar = false;
    this.funcionarioInativando = null;
    this.motivoInativacao = '';
  }

  public confirmarInativacao(): void {
    if (!this.funcionarioInativando?.idPessoa) return;
    if (!this.motivoInativacao.trim()) {
      alert('Por favor, informe o motivo da inativação.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || '';
    this.deleteService.inativarUsuario(
      this.funcionarioInativando.idPessoa, 
      this.motivoInativacao.trim(),
      token
    ).subscribe({
      next: () => {
        alert('Funcionário inativado com sucesso!');
        this.fecharModalInativar();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Erro ao inativar funcionário:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar funcionário.';
        alert(msg);
      }
    });
  }

  // Pagination methods for Administradores
  public irParaPaginaAdmins(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginasAdmins) {
      this.paginaAtualAdmins = pagina;
      this.loadAdministradores();
    }
  }

  public paginaAnteriorAdmins(): void {
    if (this.paginaAtualAdmins > 0) {
      this.paginaAtualAdmins--;
      this.loadAdministradores();
    }
  }

  public proximaPaginaAdmins(): void {
    if (this.paginaAtualAdmins < this.totalPaginasAdmins - 1) {
      this.paginaAtualAdmins++;
      this.loadAdministradores();
    }
  }

  public getPaginasVisiveisAdmins(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);
    let inicio = Math.max(0, this.paginaAtualAdmins - metade);
    let fim = Math.min(this.totalPaginasAdmins, inicio + maxPaginas);
    
    if (fim - inicio < maxPaginas) {
      inicio = Math.max(0, fim - maxPaginas);
    }
    
    const paginas: number[] = [];
    for (let i = inicio; i < fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  // Pagination methods for Funcionarios
  public irParaPaginaFuncs(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginasFuncs) {
      this.paginaAtualFuncs = pagina;
      this.loadFuncionarios();
    }
  }

  public paginaAnteriorFuncs(): void {
    if (this.paginaAtualFuncs > 0) {
      this.paginaAtualFuncs--;
      this.loadFuncionarios();
    }
  }

  public proximaPaginaFuncs(): void {
    if (this.paginaAtualFuncs < this.totalPaginasFuncs - 1) {
      this.paginaAtualFuncs++;
      this.loadFuncionarios();
    }
  }

  public getPaginasVisiveisFuncs(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);
    let inicio = Math.max(0, this.paginaAtualFuncs - metade);
    let fim = Math.min(this.totalPaginasFuncs, inicio + maxPaginas);
    
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