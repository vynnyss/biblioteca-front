import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { BookModel } from '../../../../../models/book-model';
import { DetalhesEdicao } from '../detalhes-edicao/detalhes-edicao';

@Component({
  selector: 'app-lista-edicoes',
  standalone: true,
  imports: [CommonModule, FormsModule, DetalhesEdicao, RouterLink],
  templateUrl: './lista-edicoes.html',
  styleUrl: './lista-edicoes.css'
})
export class ListaEdicoes implements OnInit {
  public edicoes: BookModel[] = [];
  private allEdicoes: BookModel[] = [];
  public selectedEdicao: BookModel | null = null;
  // filters
  public titleQuery: string = '';
  public publisherQuery: string = '';
  public yearFilter: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];
  public availablePublishers: string[] = [];

  constructor(private serv: GetServicos) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.allEdicoes = [];
      this.edicoes = [];
      return;
    }

    this.serv.getApiUrlGetEdicoes(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.allEdicoes = response?.conteudo || [];
        this.availableStatuses = Array.from(new Set(this.allEdicoes.map(e => e.statusAtivo))).filter(s => !!s);
        this.applyFilters();
      },
      error: (err: any) => {
        console.error('Erro ao carregar edições:', err);
        this.edicoes = [];
      }
    });
  }

  public applyFilters() {
    let items = this.allEdicoes.slice();
    const tq = (this.titleQuery || '').trim().toLowerCase();
    const pq = (this.publisherQuery || '').trim().toLowerCase();
    const yf = (this.yearFilter || '').trim();
    const sf = (this.statusFilter || '').trim();

    if (tq) {
      items = items.filter(e => (e.titulo?.nome || '').toLowerCase().indexOf(tq) !== -1);
    }

    if (pq) {
      items = items.filter(e => (e.editora?.nome || '').toLowerCase().indexOf(pq) !== -1);
    }

    if (yf) {
      items = items.filter(e => {
        const y = e.dtPublicacao ? e.dtPublicacao.slice(0,4) : '';
        return y === yf.toString();
      });
    }

    if (sf) {
      items = items.filter(e => ((e.statusAtivo || '') === sf));
    }

    this.edicoes = items;
  }

  public clearFilters() {
    this.titleQuery = '';
    this.publisherQuery = '';
    this.yearFilter = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public getId(ed: BookModel): number | null {
    if (!ed) return null;
    return (ed.idEdicao ?? null);
  }

  public getName(ed: BookModel): string {
    if (!ed) return '';
    return ed.titulo.nome ?? JSON.stringify(ed);
  }

  public getEditora(ed: BookModel): string {
    if (!ed) return '';
    return ed.editora?.nome || 'Desconhecida';
  }

  public getAno(ed: BookModel): string {
    if (!ed) return '';
    return ed.dtPublicacao ? ed.dtPublicacao.slice(0, 4) : '—';
  }

  public getStatus(ed: BookModel): string {
    if (!ed) return '';
    return (ed.statusAtivo ?? '—') as string;
  }

  public showDetails(ed: BookModel) {
    this.selectedEdicao = ed;
  }

  public clearDetails() {
    this.selectedEdicao = null;
  }

}
