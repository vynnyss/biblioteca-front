import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { ExemplarModel } from '../../../../../models/exemplar-model';

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

  constructor(private serv: GetServicos) {}

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
}