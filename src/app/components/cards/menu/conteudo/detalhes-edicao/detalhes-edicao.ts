import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookModel } from '../../../../../models/book-model';
import { ListaExemplares } from '../lista-exemplares/lista-exemplares';
import { PostService } from '../../../../../servicos/api/post-service';

@Component({
  selector: 'app-detalhes-edicao',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaExemplares],
  templateUrl: './detalhes-edicao.html',
  styleUrl: './detalhes-edicao.css'
})
export class DetalhesEdicao {
  private apiService = inject(PostService);
  
  @Input() edicao: BookModel | null = null;
  @Output() close = new EventEmitter<void>();

  mostrarModalExemplar: boolean = false;
  recarregarExemplares: boolean = false;
  novoExemplar = {
    estadoFisico: '',
    qtdEstoque: 1,
    edicaoId: null as number | null
  };

  public onClose() {
    this.close.emit();
  }

  // Presentation helpers (mirror those in BookDetails)
  public getAuthor(): string {
    return this.edicao?.titulo?.autores?.[0]?.nome || 'Desconhecido';
  }

  public getYear(): string {
    return this.edicao?.dtPublicacao ? this.edicao.dtPublicacao.slice(0,4) : '';
  }

  public getCategories(): string {
    return this.edicao?.titulo?.categorias?.map((c: any) => c.nome).join(', ') || '';
  }

  abrirModalNovoExemplar(): void {
    this.novoExemplar = {
      estadoFisico: '',
      qtdEstoque: 1,
      edicaoId: this.edicao?.idEdicao || null
    };
    this.mostrarModalExemplar = true;
  }

  fecharModalExemplar(): void {
    this.mostrarModalExemplar = false;
    this.novoExemplar = {
      estadoFisico: '',
      qtdEstoque: 1,
      edicaoId: null
    };
  }

  salvarNovoExemplar(): void {
    if (!this.novoExemplar.estadoFisico) {
      alert('Selecione o estado físico.');
      return;
    }
    if (this.novoExemplar.qtdEstoque == null || this.novoExemplar.qtdEstoque < 1) {
      alert('Informe uma quantidade válida (mínimo 1).');
      return;
    }
    if (!this.novoExemplar.edicaoId) {
      alert('ID da edição não encontrado.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || undefined;
    const payload = {
      estadoFisico: this.novoExemplar.estadoFisico,
      qtdEstoque: this.novoExemplar.qtdEstoque,
      edicaoId: this.novoExemplar.edicaoId
    };

    console.log('[DetalhesEdicao] Cadastrando novo exemplar:', payload);
    
    this.apiService.postExemplar(payload, token).subscribe({
      next: (exemplarNovo: any) => {
        console.log('[DetalhesEdicao] Exemplar cadastrado com sucesso:', exemplarNovo);
        alert(`Exemplar cadastrado com sucesso! Quantidade: ${this.novoExemplar.qtdEstoque}`);
        this.fecharModalExemplar();
        // Força o reload da lista de exemplares alterando o valor booleano
        this.recarregarExemplares = !this.recarregarExemplares;
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao cadastrar exemplar:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao cadastrar exemplar. Tente novamente.';
        alert(msg);
      }
    });
  }
}
