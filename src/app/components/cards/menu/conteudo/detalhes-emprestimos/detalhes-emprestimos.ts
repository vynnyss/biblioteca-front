import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
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
  public userRole: string = '';

  constructor(private serv: GetServicos, private putService: PutService) {
    this.loadUserRole();
  }

  private loadUserRole() {
    try {
      const raw = sessionStorage.getItem('decodedToken');
      if (raw) {
        const decoded = JSON.parse(raw) as { role?: string };
        this.userRole = decoded?.role ?? '';
      }
    } catch (e) {
      console.error('Erro ao ler decodedToken:', e);
      this.userRole = '';
    }
  }

  public isCliente(): boolean {
    return this.userRole === 'CLIENTE';
  }

  public temMultaPendente(): boolean {
    if (!this.emprestimo?.multa) return false;
    return (this.emprestimo.multa.valor > 0) && 
           (this.emprestimo.multa.statusPagamento === 'PENDENTE' || 
            this.emprestimo.multa.statusPagamento === 'EM_ATRASO');
  }

  public isDevolvido(): boolean {
    return this.emprestimo?.status === 'DEVOLVIDO';
  }

  public isPerdido(): boolean {
    return this.emprestimo?.status === 'EXEMPLAR_PERDIDO';
  }

  public isCancelado(): boolean {
    return this.emprestimo?.status === 'CANCELADO';
  }

  public isAdministrador(): boolean {
    return this.userRole === 'ADMINISTRADOR';
  }

  public temMulta(): boolean {
    return this.emprestimo?.multa?.valor != null && this.emprestimo.multa.valor > 0 && this.emprestimo.multa.statusPagamento == 'PENDENTE';
  }

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

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    this.serv.getApiUrlGetEmprestimosPorID(id, token).subscribe({
      next: (res: EmprestimoModel) => {
        console.log("resposta: ", res)
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

  public registrarSeparacao() {
    if (!this.emprestimo?.idEmprestimo) return;
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.putService.registrarSeparacao(this.emprestimo.idEmprestimo, token).subscribe({
      next: () => {
        alert('Separação registrada com sucesso!');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao registrar separação:', err);
        alert('Erro ao registrar separação.');
      }
    });
  }

  public registrarRetirada() {
    if (!this.emprestimo?.idEmprestimo) return;
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.putService.registrarRetirada(this.emprestimo.idEmprestimo, token).subscribe({
      next: () => {
        alert('Retirada registrada com sucesso!');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao registrar retirada:', err);
        alert('Erro ao registrar retirada.');
      }
    });
  }

  public registrarDevolucao() {
    if (!this.emprestimo?.idEmprestimo) return;
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.putService.registrarDevolucao(this.emprestimo.idEmprestimo, token).subscribe({
      next: () => {
        alert('Devolução registrada com sucesso!');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao registrar devolução:', err);
        alert('Erro ao registrar devolução.');
      }
    });
  }

  public registrarPerda() {
    if (!this.emprestimo?.idEmprestimo) return;
    
    const confirmar = confirm('Confirma o registro de perda deste livro? Uma multa será aplicada ao usuário.');
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    this.putService.registrarPerda(this.emprestimo.idEmprestimo, token).subscribe({
      next: () => {
        alert('Perda registrada com sucesso! Multa aplicada ao usuário.');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao registrar perda:', err);
        const errorMsg = err?.error?.mensagem || err?.message || 'Erro ao registrar perda';
        alert(errorMsg);
      }
    });
  }

  public pagarMulta() {
    if (!this.emprestimo?.idEmprestimo) return;
    
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('❌ Token de autenticação não encontrado. Faça login novamente.');
      return;
    }

    this.putService.pagarMulta(this.emprestimo.idEmprestimo, token).subscribe({
      next: () => {
        alert('✅ Multa paga com sucesso!');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao pagar multa:', err);
        const errorMsg = err?.error?.mensagem || err?.message || 'Erro ao processar pagamento da multa';
        alert(errorMsg);
      }
    });
  }

  public perdoarMulta() {
    if (!this.emprestimo?.multa?.idMulta) return;
    
    const confirmar = confirm('Confirma o perdão desta multa?');
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    this.putService.perdoarMulta(this.emprestimo.multa.idMulta, token).subscribe({
      next: () => {
        alert('Multa perdoada com sucesso!');
        this.load(this.emprestimo!.idEmprestimo);
      },
      error: (err) => {
        console.error('Erro ao perdoar multa:', err);
        const errorMsg = err?.error?.mensagem || err?.message || 'Erro ao perdoar multa';
        alert(errorMsg);
      }
    });
  }

}
