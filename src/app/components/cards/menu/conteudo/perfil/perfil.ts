import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { Pessoa } from '../../../../../models/pessoa-model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnChanges {
  @Input() email?: string;

  public pessoa: Pessoa | null = null;
  public loading = false;
  public error: string | null = null;

  constructor(private svc: GetServicos) {}

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
      next: (p: Pessoa) => {
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
}
