import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { ListaEmprestimoModel } from '../../../../../models/lista-emprestimo-model';
import { DetalhesEmprestimos } from '../detalhes-emprestimos/detalhes-emprestimos';

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

  constructor(private serv: GetServicos) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.loading = true;
    this.error = null;
    this.serv.getApiUrlGetEmprestimos().subscribe({
      next: (list: ListaEmprestimoModel[]) => {
        this.allEmprestimos = list || [];
        this.availableStatuses = Array.from(new Set(this.allEmprestimos.map(x => x.status))).filter(s => !!s);
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar emprestimos:', err);
        this.error = 'Erro ao carregar empréstimos.';
        this.loading = false;
      }
    });
  }

  public showDetails(id: number) {
    this.selectedId = id;
  }

  public clearDetails() {
    this.selectedId = null;
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

    // pessoa query: match idPessoa as string (partial) or exact
    const q = (this.pessoaQuery || '').trim().toLowerCase();
    if (q) {
      items = items.filter(i => String(i.idPessoa).toLowerCase().indexOf(q) !== -1);
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
