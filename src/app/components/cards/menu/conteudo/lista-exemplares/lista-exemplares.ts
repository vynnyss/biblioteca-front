import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { ExemplarModel } from '../../../../../models/exemplar-model';
import { DecodeToken } from '../../../../../models/decode-token';

@Component({
  selector: 'app-lista-exemplares',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-exemplares.html',
  styleUrl: './lista-exemplares.css'
})
export class ListaExemplares implements OnChanges {
  @Input() edicaoId?: number | null;

  public exemplares: ExemplarModel[] = [];
  public loading = false;
  public error: string | null = null;

  constructor(private serv: GetServicos, private putService: PutService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('edicaoId' in changes) {
      const id = this.edicaoId;
      if (id != null) {
        this.loadExemplares(id);
      } else {
        this.exemplares = [];
      }
    }
  }

  private loadExemplares(id: number) {
    this.loading = true;
    this.error = null;
    this.serv.getApiUrlGetExemplaresDaEdicao(id).subscribe({
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
      return decoded.role === 'BIBLIOTECARIO' || decoded.role === 'FUNCIONARIO';
    } catch {
      return false;
    }
  }

  public podeExcluir(item: ExemplarModel): boolean {
    return this.isBibliotecario();
  }

  public solicitarExclusaoExemplar(item: ExemplarModel) {
    if (!item?.idExemplar) return;
    if (!confirm('Deseja realmente solicitar a exclusão deste exemplar?')) return;
    this.putService.solicitarExclusaoExemplar(item.idExemplar).subscribe({
      next: () => {
        alert('Solicitação de exclusão enviada com sucesso!');
        // Recarregar lista para atualizar status
        if (this.edicaoId) {
          this.loadExemplares(this.edicaoId);
        }
      },
      error: (err) => {
        console.error('Erro ao solicitar exclusão de exemplar:', err);
        alert('Erro ao solicitar exclusão do exemplar.');
      }
    });
  }
}