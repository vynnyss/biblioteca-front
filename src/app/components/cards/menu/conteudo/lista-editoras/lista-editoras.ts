import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
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

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

  // edição
  public editandoId: number | null = null;
  public novoNome: string = '';

  constructor(private serv: GetServicos, private putService: PutService) {}

  ngOnInit(): void {
    this.serv.getApiUrlGetEditoras().subscribe({
      next: (list: EditoraModel[]) => {
        this.allEditoras = list || [];
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
    this.putService.atualizarNomeEditora(this.editandoId, this.novoNome.trim()).subscribe({
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
}