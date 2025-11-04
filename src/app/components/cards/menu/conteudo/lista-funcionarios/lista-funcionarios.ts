import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PessoaModel } from '../../../../../models/pessoa-model';

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

  constructor(private svc: GetServicos) {}

  ngOnInit(): void {
    this.loadAdministradores();
    this.loadFuncionarios();
  }

  private loadAdministradores(): void {
    this.loadingAdmins = true;
    this.svc.getApiUrlGetAdministradores().subscribe({
      next: (list: PessoaModel[]) => {
        this.allAdministradores = list || [];
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
    this.svc.getApiUrlGetFuncionarios().subscribe({
      next: (list: PessoaModel[]) => {
        this.allFuncionarios = list || [];
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
}

