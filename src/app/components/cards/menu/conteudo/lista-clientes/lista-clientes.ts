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

    this.svc.getApiUrlGetClientes(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.allClientes = response?.conteudo || [];
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
}
