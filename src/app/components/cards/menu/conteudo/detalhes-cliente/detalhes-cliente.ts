import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaModel } from '../../../../../models/pessoa-model';
import { PutService } from '../../../../../servicos/api/put-service';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { PostService } from '../../../../../servicos/api/post-service';
import { DecodeToken } from '../../../../../models/decode-token';
import { ListaEmprestimoModel } from '../../../../../models/lista-emprestimo-model';
import { Emprestimo } from '../../../../../models/emprestimo';
import { AuthHelper } from '../../../../../servicos/utils/auth-helper';

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
//    console.log('DetalhesCliente: cliente input set to', value);
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

  public mostrarModalEmprestimo = false;
  public edicoesAtivas: any[] = [];
  public edicoesSelecionadas: number[] = [];
  public loadingEdicoes = false;
  public termoBuscaEdicao = '';
  public edicoesFiltradas: any[] = [];

  constructor(
    private putService: PutService, 
    private getService: GetServicos,
    private deleteService: DeleteService,
    private postService: PostService,
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
    
    if (this.motivoInativacao.trim().length < 10) {
      alert('O motivo deve ter no mínimo 10 caracteres.');
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
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
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
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    this.putService.aprovarConta(this.cliente.idPessoa, token).subscribe({
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
    
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    
    this.putService.rejeitarConta(this.cliente.idPessoa, this.motivoRejeicao, token).subscribe({
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
    if (this.motivoExclusao.trim().length < 10) {
      alert('O motivo deve ter no mínimo 10 caracteres.');
      return;
    }
    
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    
    this.putService.solicitarExclusaoConta(this.cliente.idPessoa, this.motivoExclusao, token).subscribe({
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

  public rejeitarExclusao() {
    if (!this.cliente?.idPessoa) return;
    
    if (!confirm('Deseja realmente rejeitar a solicitação de exclusão deste cliente?')) {
      return;
    }
    
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    
    this.putService.rejeitarExclusaoConta(this.cliente.idPessoa, token).subscribe({
      next: () => {
        alert('Solicitação de exclusão rejeitada com sucesso!');
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao rejeitar exclusão:', err);
        alert('Erro ao rejeitar a solicitação de exclusão.');
      }
    });
  }

  public abrirModalEmprestimo() {
    this.mostrarModalEmprestimo = true;
    this.edicoesSelecionadas = [];
    this.termoBuscaEdicao = '';
    this.carregarEdicoesAtivas();
  }

  public fecharModalEmprestimo() {
    this.mostrarModalEmprestimo = false;
    this.edicoesSelecionadas = [];
    this.edicoesAtivas = [];
    this.edicoesFiltradas = [];
    this.termoBuscaEdicao = '';
  }

  private carregarEdicoesAtivas() {
    this.loadingEdicoes = true;
    this.getService.getApiUrlGetEdicoesAtivas(0, 1000).subscribe({
      next: (response: any) => {
        this.edicoesAtivas = response?.conteudo || [];
        this.edicoesFiltradas = [...this.edicoesAtivas];
        this.loadingEdicoes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar edições ativas:', err);
        alert('Erro ao carregar edições ativas.');
        this.loadingEdicoes = false;
      }
    });
  }

  public filtrarEdicoes() {
    const termo = this.termoBuscaEdicao.toLowerCase().trim();
    if (!termo) {
      this.edicoesFiltradas = [...this.edicoesAtivas];
      return;
    }
    
    this.edicoesFiltradas = this.edicoesAtivas.filter(edicao => {
      const titulo = edicao.titulo?.nome?.toLowerCase() || '';
      const editora = edicao.editora?.nome?.toLowerCase() || '';
      const ano = edicao.anoPublicacao?.toString() || '';
      return titulo.includes(termo) || editora.includes(termo) || ano.includes(termo);
    });
  }

  public toggleSelecaoEdicao(idEdicao: number) {
    const index = this.edicoesSelecionadas.indexOf(idEdicao);
    if (index > -1) {
      this.edicoesSelecionadas.splice(index, 1);
    } else {
      this.edicoesSelecionadas.push(idEdicao);
    }
  }

  public isEdicaoSelecionada(idEdicao: number): boolean {
    return this.edicoesSelecionadas.includes(idEdicao);
  }

  public realizarEmprestimo() {
    if (!this.cliente?.idPessoa) return;
    
    if (this.edicoesSelecionadas.length === 0) {
      alert('Por favor, selecione pelo menos uma edição.');
      return;
    }
    
    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }
    
    const emprestimo: Emprestimo = {
      idsEdicao: this.edicoesSelecionadas,
      idPessoa: this.cliente.idPessoa
    };
    
    this.postService.postEmprestimo(emprestimo, token).subscribe({
      next: () => {
        alert('Empréstimo realizado com sucesso!');
        this.fecharModalEmprestimo();
        this.carregarEmprestimos(this.cliente!.idPessoa);
      },
      error: (err) => {
        console.error('Erro ao realizar empréstimo:', err);
        const mensagem = err.error?.mensagem || err.mensagem || err.message || 'Erro desconhecido ao realizar empréstimo.';
        alert(mensagem);
      }
    });
  }

  private carregarEmprestimos(idPessoa: number): void {
    this.loadingEmprestimos = true;
    this.errorEmprestimos = null;
    this.emprestimos = [];

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.errorEmprestimos = 'Token de autenticação não encontrado.';
      this.loadingEmprestimos = false;
      return;
    }
    
    this.getService.getApiUrlGetEmprestimosPorPessoa(idPessoa, token, 0, 1000).subscribe({
      next: (response: any) => {
        this.emprestimos = response?.conteudo || [];
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
