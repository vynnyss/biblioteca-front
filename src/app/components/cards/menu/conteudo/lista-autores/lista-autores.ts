import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
<<<<<<< HEAD
import { PutService } from '../../../../../servicos/api/put-service';
=======
>>>>>>> origin/dev
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

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

<<<<<<< HEAD
  // edição
  public editandoId: number | null = null;
  public novoNome: string = '';

  constructor(private serv: GetServicos, private putService: PutService) {}
=======
  constructor(private serv: GetServicos) {}
>>>>>>> origin/dev

  ngOnInit(): void {
    this.serv.getApiUrlGetAutores().subscribe({
      next: (list: AutorModel[]) => {
        this.allAutores = list || [];
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
<<<<<<< HEAD

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
    this.putService.atualizarNomeAutor(this.editandoId, this.novoNome.trim()).subscribe({
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
=======
>>>>>>> origin/dev
}
