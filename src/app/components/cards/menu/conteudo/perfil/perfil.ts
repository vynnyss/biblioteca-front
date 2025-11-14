import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PessoaModel } from '../../../../../models/pessoa-model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnChanges {
  @Input() email?: string;

  public pessoa: PessoaModel | null = null;
  public loading = false;
  public error: string | null = null;

  constructor(private svc: GetServicos, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['email']) {
      const email = changes['email'].currentValue as string | undefined;
      if (email) this.loadPessoa(email);
    }
  }

  private loadPessoa(email: string) {
    this.pessoa = null;
    this.error = null;
    this.loading = true;

    this.svc.getPessoaPorEmail(email).subscribe({
      next: (p: PessoaModel) => {
        this.pessoa = p;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Perfil: erro ao buscar pessoa', err);
        this.error = 'Não foi possível carregar os dados do perfil.';
        this.loading = false;
      }
    });
  }

  public formatarCPF(cpf?: string): string {
    if (!cpf) return '—';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  public editarPerfil(): void {
    if (!this.pessoa?.idPessoa) return;
    this.router.navigate(['/atualizacao/pessoa'], { 
      state: { idCliente: this.pessoa.idPessoa } 
    });
  }
}
