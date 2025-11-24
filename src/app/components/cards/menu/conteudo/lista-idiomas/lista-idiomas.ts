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

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = [];

  // edição
  public editandoId: number | null = null;
  public novoNome: string = '';

  constructor(
    private serv: GetServicos, 
    private putService: PutService,
    private deleteService: DeleteService
  ) {}

  ngOnInit(): void {
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
    this.idiomas = items;
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

    this.deleteService.inativarIdioma(idioma.idIdioma).subscribe({
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
}
