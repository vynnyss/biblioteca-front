import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { EmprestimoModel } from '../../../../../models/emprestimo-model';

@Component({
  selector: 'app-detalhes-emprestimos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhes-emprestimos.html',
  styleUrl: './detalhes-emprestimos.css'
})
export class DetalhesEmprestimos {
  @Input() idEmprestimo?: number | null;
  @Output() close = new EventEmitter<void>();

  public onClose() {
    this.close.emit();
  }

  public emprestimo: EmprestimoModel | null = null;
  public loading = false;
  public error: string | null = null;

  constructor(private serv: GetServicos) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('idEmprestimo' in changes) {
      const id = this.idEmprestimo;
      if (id != null) {
        this.load(id);
      } else {
        this.emprestimo = null;
      }
    }
  }

  private load(id: number) {
    this.loading = true;
    this.error = null;
    this.emprestimo = null;
    this.serv.getApiUrlGetEmprestimosPorID(id).subscribe({
      next: (res: EmprestimoModel) => {
        this.emprestimo = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar empréstimo:', err);
        this.error = 'Não foi possível carregar os detalhes do empréstimo.';
        this.loading = false;
      }
    });
  }

}
