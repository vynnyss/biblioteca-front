import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaModel } from '../../../../../models/pessoa-model';
import { PutService } from '../../../../../servicos/api/put-service';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { DecodeToken } from '../../../../../models/decode-token';
import { ListaEmprestimoModel } from '../../../../../models/lista-emprestimo-model';

@Component({
  selector: 'app-detalhes-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhes-cliente.html',
  styleUrls: ['./detalhes-cliente.css']
})
export class DetalhesCliente {
  @Input() set cliente(value: PessoaModel | null) {
    this._cliente = value;
    if (value?.idPessoa) {
      this.carregarEmprestimos(value.idPessoa);
    } else {
      this.emprestimos = [];
    }
  }
  get cliente(): PessoaModel | null {
    return this._cliente;
  }
  private _cliente: PessoaModel | null = null;

  @Output() close = new EventEmitter<void>();

  public emprestimos: ListaEmprestimoModel[] = [];
  public loadingEmprestimos = false;
  public errorEmprestimos: string | null = null;

  public mostrarModalRejeicao = false;
  public motivoRejeicao = '';

  public mostrarModalExclusao = false;
  public motivoExclusao = '';

  public mostrarModalInativacao = false;
  public motivoInativacao = '';

  constructor(
    private putService: PutService, 
    private getService: GetServicos,
    private deleteService: DeleteService,
    private router: Router
  ) {}

  public onClose() {
    this.close.emit();
  }

  public editarCliente() {
    if (!this.cliente?.idPessoa) return;
    this.router.navigate(['/atualizacao/pessoa'], { 
      state: { idCliente: this.cliente.idPessoa } 
    });
  }

  public inativarCliente() {
    if (!this.cliente?.idPessoa) return;
    this.abrirModalInativacao();
  }

  public abrirModalInativacao() {
    this.mostrarModalInativacao = true;
    this.motivoInativacao = '';
  }

  public fecharModalInativacao() {
    this.mostrarModalInativacao = false;
    this.motivoInativacao = '';
  }

  public confirmarInativacao() {
    if (!this.cliente?.idPessoa) return;
    
    if (!this.motivoInativacao.trim()) {
      alert('Por favor, informe o motivo da inativação.');
      return;
    }
    
    if (this.motivoInativacao.trim().length < 8) {
      alert('O motivo deve ter no mínimo 8 caracteres.');
      return;
    }
    
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    
    this.deleteService.inativarUsuario(this.cliente.idPessoa, this.motivoInativacao, token).subscribe({
      next: () => {
        alert('Cliente inativado com sucesso!');
        this.fecharModalInativacao();
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao inativar cliente:', err);
        alert('Erro ao inativar cliente.');
      }
    });
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

  public aprovarConta() {
    if (!this.cliente?.idPessoa) return;
    this.putService.aprovarConta(this.cliente.idPessoa).subscribe({
      next: () => {
        alert('Conta aprovada com sucesso!');
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao aprovar conta:', err);
        alert('Erro ao aprovar conta.');
      }
    });
  }

  public abrirModalRejeicao() {
    this.mostrarModalRejeicao = true;
    this.motivoRejeicao = '';
  }

  public fecharModalRejeicao() {
    this.mostrarModalRejeicao = false;
    this.motivoRejeicao = '';
  }

  public rejeitarConta() {
    if (!this.cliente?.idPessoa) return;
    if (!this.motivoRejeicao.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }
    if (this.motivoRejeicao.trim().length < 8) {
      alert('O motivo deve ter no mínimo 8 caracteres.');
      return;
    }
    
    this.putService.rejeitarConta(this.cliente.idPessoa, this.motivoRejeicao).subscribe({
      next: () => {
        alert('Conta rejeitada com sucesso!');
        this.fecharModalRejeicao();
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao rejeitar conta:', err);
        alert('Erro ao rejeitar conta.');
      }
    });
  }

  public abrirModalExclusao() {
    this.mostrarModalExclusao = true;
    this.motivoExclusao = '';
  }

  public fecharModalExclusao() {
    this.mostrarModalExclusao = false;
    this.motivoExclusao = '';
  }

  public solicitarExclusao() {
    if (!this.cliente?.idPessoa) return;
    if (!this.motivoExclusao.trim()) {
      alert('Por favor, informe o motivo da exclusão.');
      return;
    }
    if (this.motivoExclusao.trim().length < 8) {
      alert('O motivo deve ter no mínimo 8 caracteres.');
      return;
    }
    
    this.putService.solicitarExclusaoConta(this.cliente.idPessoa, this.motivoExclusao).subscribe({
      next: () => {
        alert('Solicitação de exclusão enviada com sucesso!');
        this.fecharModalExclusao();
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao solicitar exclusão:', err);
        alert('Erro ao solicitar exclusão da conta.');
      }
    });
  }

  private carregarEmprestimos(idPessoa: number): void {
    this.loadingEmprestimos = true;
    this.errorEmprestimos = null;
    this.emprestimos = [];
    
    this.getService.getApiUrlGetEmprestimosPorPessoa(idPessoa).subscribe({
      next: (lista) => {
        this.emprestimos = lista || [];
        this.loadingEmprestimos = false;
      },
      error: (err) => {
        console.error('Erro ao carregar empréstimos do cliente:', err);
        this.errorEmprestimos = 'Erro ao carregar empréstimos.';
        this.emprestimos = [];
        this.loadingEmprestimos = false;
      }
    });
  }
}
