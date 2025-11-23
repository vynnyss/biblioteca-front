import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BookModel } from '../../../../../models/book-model';
import { ListaExemplares } from '../lista-exemplares/lista-exemplares';
import { PostService } from '../../../../../servicos/api/post-service';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { Title } from '../../../../../models/title';

@Component({
  selector: 'app-detalhes-edicao',
  standalone: true,
  imports: [CommonModule, FormsModule, ListaExemplares],
  templateUrl: './detalhes-edicao.html',
  styleUrl: './detalhes-edicao.css'
})
export class DetalhesEdicao {
  private apiService = inject(PostService);
  private putService = inject(PutService);
  private deleteService = inject(DeleteService);
  private http = inject(HttpClient);
  
  @Input() edicao: BookModel | null = null;
  @Output() close = new EventEmitter<void>();

  mostrarModalExemplar: boolean = false;
  recarregarExemplares: boolean = false;
  novoExemplar = {
    estadoFisico: '',
    qtdEstoque: 1,
    edicaoId: null as number | null
  };

  // Edit edition modal
  mostrarModalEdicao: boolean = false;
  titulos: Title[] = [];
  editoras: any[] = [];
  idiomas: any[] = [];
  
  edicaoEditada = {
    idTitulo: null as number | null,
    idEditora: null as number | null,
    idIdioma: null as number | null,
    descricaoEdicao: '',
    dataPublicacao: '',
    qtdPaginas: null as number | null,
    tipoCapa: '',
    tamanho: '',
    classificacao: '',
    imagemFile: null as File | null
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

  abrirModalEdicao(): void {
    if (!this.edicao) return;
    
    // Load data for dropdowns
    this.carregarTitulos();
    this.carregarEditoras();
    this.carregarIdiomas();
    
    // Pre-fill form with current edition data
    this.edicaoEditada = {
      idTitulo: this.edicao.titulo?.idTitulo || null,
      idEditora: this.edicao.editora?.idEditora || null,
      idIdioma: this.edicao.idioma?.idIdioma || null,
      descricaoEdicao: this.edicao.descricaoEdicao || '',
      dataPublicacao: this.edicao.dtPublicacao || '',
      qtdPaginas: this.edicao.qtdPaginas || null,
      tipoCapa: this.edicao.tipoCapa || '',
      tamanho: this.edicao.tamanho || '',
      classificacao: this.edicao.classificacao || '',
      imagemFile: null
    };
    
    this.mostrarModalEdicao = true;
  }

  fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.edicaoEditada = {
      idTitulo: null,
      idEditora: null,
      idIdioma: null,
      descricaoEdicao: '',
      dataPublicacao: '',
      qtdPaginas: null,
      tipoCapa: '',
      tamanho: '',
      classificacao: '',
      imagemFile: null
    };
  }

  carregarTitulos(): void {
    const token = sessionStorage.getItem('authToken') || undefined;
    this.apiService.getTitulos(token).subscribe({
      next: (titulos) => {
        this.titulos = titulos || [];
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao carregar títulos:', err);
        alert('Erro ao carregar lista de títulos.');
      }
    });
  }

  carregarEditoras(): void {
    const token = sessionStorage.getItem('authToken');
    this.http.get<any[]>('http://localhost:8080/editoras', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (editoras: any) => {
        this.editoras = Array.isArray(editoras) ? editoras : [];
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao carregar editoras:', err);
        alert('Erro ao carregar lista de editoras.');
      }
    });
  }

  carregarIdiomas(): void {
    const token = sessionStorage.getItem('authToken');
    this.http.get<any[]>('http://localhost:8080/idiomas', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (idiomas: any) => {
        this.idiomas = Array.isArray(idiomas) ? idiomas : [];
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao carregar idiomas:', err);
        alert('Erro ao carregar lista de idiomas.');
      }
    });
  }

  onImagemEdicaoChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        event.target.value = '';
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('A imagem deve ter no máximo 5MB.');
        event.target.value = '';
        return;
      }
      this.edicaoEditada.imagemFile = file;
    } else {
      this.edicaoEditada.imagemFile = null;
    }
  }

  salvarEdicao(): void {
    if (!this.edicao?.idEdicao) {
      alert('ID da edição não encontrado.');
      return;
    }

    // Validations
    if (!this.edicaoEditada.idTitulo) {
      alert('Por favor, selecione um título.');
      return;
    }
    if (!this.edicaoEditada.dataPublicacao) {
      alert('Por favor, informe a data de publicação.');
      return;
    }
    if (!this.edicaoEditada.idEditora) {
      alert('Por favor, selecione uma editora.');
      return;
    }
    if (!this.edicaoEditada.idIdioma) {
      alert('Por favor, selecione um idioma.');
      return;
    }
    if (!this.edicaoEditada.qtdPaginas || this.edicaoEditada.qtdPaginas < 1) {
      alert('Por favor, informe uma quantidade válida de páginas.');
      return;
    }
    if (!this.edicaoEditada.tipoCapa) {
      alert('Por favor, selecione o tipo de capa.');
      return;
    }
    if (!this.edicaoEditada.tamanho) {
      alert('Por favor, selecione o tamanho do livro.');
      return;
    }
    if (!this.edicaoEditada.classificacao) {
      alert('Por favor, selecione a classificação indicativa.');
      return;
    }
    if (!this.edicaoEditada.descricaoEdicao?.trim()) {
      alert('Por favor, informe a descrição da edição.');
      return;
    }

    // Mapeia tipo de capa para o formato do backend
    const mapTipoCapa: any = {
      'dura': 'DURA',
      'flexivel': 'MOLE',
    };
    const tipoCapa = mapTipoCapa[this.edicaoEditada.tipoCapa] || this.edicaoEditada.tipoCapa.toUpperCase();

    // Cria o objeto JSON para o campo "edicao"
    const edicaoData = {
      descricaoEdicao: this.edicaoEditada.descricaoEdicao.trim(),
      tipoCapa: tipoCapa,
      qtdPaginas: this.edicaoEditada.qtdPaginas,
      tamanho: this.edicaoEditada.tamanho.toUpperCase(),
      classificacao: this.edicaoEditada.classificacao.toUpperCase(),
      dtPublicacao: this.edicaoEditada.dataPublicacao,
      tituloId: this.edicaoEditada.idTitulo,
      editoraId: this.edicaoEditada.idEditora,
      idiomaId: this.edicaoEditada.idIdioma
    };

    // Cria FormData para enviar multipart/form-data
    const formData = new FormData();
    
    // Adiciona o JSON como Blob com tipo application/json no campo "edicao"
    const edicaoBlob = new Blob([JSON.stringify(edicaoData)], { type: 'application/json' });
    formData.append('edicao', edicaoBlob);
    
    // Adiciona a imagem se foi fornecida
    if (this.edicaoEditada.imagemFile) {
      formData.append('imagem', this.edicaoEditada.imagemFile, this.edicaoEditada.imagemFile.name);
    }

    console.log('[DetalhesEdicao] Atualizando edição:', this.edicao.idEdicao);
    console.log('[DetalhesEdicao] Dados da edição:', edicaoData);
    console.log('[DetalhesEdicao] Imagem:', this.edicaoEditada.imagemFile ? this.edicaoEditada.imagemFile.name : 'Nenhuma');
    
    this.putService.atualizarEdicao(this.edicao.idEdicao, formData).subscribe({
      next: (edicaoAtualizada: any) => {
        console.log('[DetalhesEdicao] Edição atualizada com sucesso:', edicaoAtualizada);
        alert('Edição atualizada com sucesso!');
        this.fecharModalEdicao();
        // Emit close to refresh parent list
        this.onClose();
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao atualizar edição:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao atualizar edição. Tente novamente.';
        alert(msg);
      }
    });
  }

  inativarEdicao(): void {
    if (!this.edicao?.idEdicao) {
      alert('ID da edição não encontrado.');
      return;
    }

    const confirmar = confirm(`Deseja realmente inativar a edição "${this.edicao.titulo?.nome}"?`);
    if (!confirmar) return;

    this.deleteService.inativarEdicao(this.edicao.idEdicao).subscribe({
      next: () => {
        console.log('[DetalhesEdicao] Edição inativada com sucesso');
        alert('Edição inativada com sucesso!');
        // Emit close to refresh parent list
        this.onClose();
      },
      error: (err) => {
        console.error('[DetalhesEdicao] Erro ao inativar edição:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao inativar edição. Tente novamente.';
        alert(msg);
      }
    });
  }
}
