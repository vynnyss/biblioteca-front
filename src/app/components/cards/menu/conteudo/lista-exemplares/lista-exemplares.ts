import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { ExemplarModel } from '../../../../../models/exemplar-model';
import { DecodeToken } from '../../../../../models/decode-token';

@Component({
  selector: 'app-lista-exemplares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-exemplares.html',
  styleUrl: './lista-exemplares.css'
})
export class ListaExemplares implements OnChanges {
  @Input() edicaoId?: number | null;
  @Input() recarregar: boolean = false;

  public exemplares: ExemplarModel[] = [];
  public loading = false;
  public error: string | null = null;

  // Modal de edição
  public mostrarModalEdicao = false;
  public exemplarEditando: ExemplarModel | null = null;
  public estadoFisicoEditado: string = '';
  public estadosFisicos: string[] = ['MUITO_RUIM', 'RUIM', 'BOM', 'OTIMO', 'EXCELENTE'];

  // Modal de exclusão (para BIBLIOTECARIO)
  public mostrarModalExclusao = false;
  public exemplarParaExcluir: ExemplarModel | null = null;
  public motivoExclusao = '';

  constructor(
    private serv: GetServicos, 
    private putService: PutService,
    private deleteService: DeleteService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('edicaoId' in changes) {
      const id = this.edicaoId;
      if (id != null) {
        this.loadExemplares(id);
      } else {
        this.exemplares = [];
      }
    }
    if ('recarregar' in changes && !changes['recarregar'].firstChange) {
      if (this.edicaoId != null) {
        this.loadExemplares(this.edicaoId);
      }
    }
  }

  private loadExemplares(id: number) {
    this.loading = true;
    this.error = null;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.exemplares = [];
      this.loading = false;
      return;
    }

    this.serv.getApiUrlGetExemplaresDaEdicao(id, token).subscribe({
      next: (list: ExemplarModel[]) => {
        this.exemplares = list || [];
        console.log('ListaExemplares: loaded exemplares', this.exemplares);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar exemplares:', err);
        this.error = 'Erro ao carregar exemplares.';
        this.exemplares = [];
        this.loading = false;
      }
    });
  }

  public getId(item: ExemplarModel): number {
    return item?.idExemplar ?? null;
  }

  public getStatus(item: ExemplarModel): string {
    return item?.status ?? '—';
  }

  public getEstadoFisico(item: ExemplarModel): string {
    return item?.estadoFisico ?? '—';
  }

  public isBibliotecario(): boolean {
    const raw = sessionStorage.getItem('decodedToken');
    if (!raw) return false;
    try {
      const decoded: DecodeToken = JSON.parse(raw);
      return decoded.role === 'BIBLIOTECARIO';
    } catch {
      return false;
    }
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

  public podeExcluir(item: ExemplarModel): boolean {
    return this.isBibliotecario() || this.isAdministrador();
  }

  public abrirModalExclusao(item: ExemplarModel): void {
    this.exemplarParaExcluir = item;
    this.motivoExclusao = '';
    this.mostrarModalExclusao = true;
  }

  public fecharModalExclusao(): void {
    this.mostrarModalExclusao = false;
    this.exemplarParaExcluir = null;
    this.motivoExclusao = '';
  }

  public confirmarSolicitacaoExclusao(): void {
    if (!this.exemplarParaExcluir?.idExemplar) return;
    if (!this.motivoExclusao.trim()) {
      alert('Por favor, informe o motivo da exclusão.');
      return;
    }
    if (this.motivoExclusao.trim().length < 8) {
      alert('O motivo deve ter no mínimo 8 caracteres.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    this.putService.solicitarExclusaoExemplar(this.exemplarParaExcluir.idExemplar, this.motivoExclusao.trim(), token).subscribe({
      next: () => {
        alert('Solicitação de exclusão enviada com sucesso!');
        this.fecharModalExclusao();
        if (this.edicaoId) {
          this.loadExemplares(this.edicaoId);
        }
      },
      error: (err) => {
        console.error('Erro ao solicitar exclusão de exemplar:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao solicitar exclusão do exemplar.';
        alert(msg);
      }
    });
  }

  public abrirModalEdicao(exemplar: ExemplarModel): void {
    this.exemplarEditando = exemplar;
    this.estadoFisicoEditado = exemplar.estadoFisico;
    this.mostrarModalEdicao = true;
  }

  public fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.exemplarEditando = null;
    this.estadoFisicoEditado = '';
  }

  public salvarEdicao(): void {
    if (!this.exemplarEditando) return;
    if (!this.estadoFisicoEditado) {
      alert('Por favor, selecione o estado físico.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    const payload = {
      estadoFisico: this.estadoFisicoEditado,
      edicaoId: this.edicaoId
    };

    this.putService.atualizarExemplar(this.exemplarEditando.idExemplar, payload, token).subscribe({
      next: () => {
        alert('Exemplar atualizado com sucesso!');
        this.fecharModalEdicao();
        if (this.edicaoId) {
          this.loadExemplares(this.edicaoId);
        }
      },
      error: (err) => {
        console.error('Erro ao atualizar exemplar:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao atualizar exemplar.';
        alert(msg);
      }
    });
  }

  public handleExclusaoOuInativacao(exemplar: ExemplarModel): void {
    if (!exemplar?.idExemplar) return;

    // BIBLIOTECARIO: solicita exclusão com motivo
    if (this.isBibliotecario()) {
      this.abrirModalExclusao(exemplar);
      return;
    }

    // ADMINISTRADOR: inativa diretamente
    if (this.isAdministrador()) {
      const confirmar = confirm(`Deseja realmente inativar o exemplar #${exemplar.idExemplar}?`);
      if (!confirmar) return;

      const token = sessionStorage.getItem('authToken');
      if (!token) {
        alert('Token de autenticação não encontrado.');
        return;
      }

      this.deleteService.inativarExemplar(exemplar.idExemplar, token).subscribe({
        next: () => {
          alert('Exemplar inativado com sucesso!');
          if (this.edicaoId) {
            this.loadExemplares(this.edicaoId);
          }
        },
        error: (err) => {
          console.error('Erro ao inativar exemplar:', err);
          const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar exemplar.';
          alert(msg);
        }
      });
    }
  }
}