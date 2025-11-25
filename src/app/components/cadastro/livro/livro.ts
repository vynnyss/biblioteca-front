import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../../servicos/api/post-service';
import { GetServicos } from '../../../servicos/api/get-servicos';
import { Title } from '../../../models/title';
import { AuthHelper } from '../../../servicos/utils/auth-helper';
import { Location } from '@angular/common';

@Component({
  selector: 'app-livro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livro.html',
  styleUrls: ['./livro.css']
})
export class Livro implements OnInit {
  private apiService = inject(PostService);
  private getService = inject(GetServicos);
  private http = inject(HttpClient);
  private location = inject(Location);
  
  titulos: Title[] = [];
  tituloSelecionado: number | string = '';
  mostrarModalTitulo: boolean = false;
  carregandoTitulos: boolean = false;
  
  autores: any[] = [];
  autoresFiltrados: any[] = [];
  termoBuscaAutor: string = '';
  autoresSelecionados: number[] = [];
  mostrarModalAutor: boolean = false;
  carregandoAutores: boolean = false;
  
  editoras: any[] = [];
  editorasFiltradas: any[] = [];
  termoBuscaEditora: string = '';
  editoraSelecionada: number | string = '';
  mostrarModalEditora: boolean = false;
  carregandoEditoras: boolean = false;
  
  idiomas: any[] = [];
  idiomasFiltrados: any[] = [];
  termoBuscaIdioma: string = '';
  idiomaSelecionado: number | string = '';
  mostrarModalIdioma: boolean = false;
  carregandoIdiomas: boolean = false;
  
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];
  termoBuscaCategoria: string = '';
  categoriasSelecionadas: number[] = [];
  mostrarModalCategoria: boolean = false;
  carregandoCategorias: boolean = false;
  
  // Busca para modal de novo título
  termoBuscaAutorTitulo: string = '';
  termoBuscaCategoriaTitulo: string = '';
  autoresFiltradosTitulo: any[] = [];
  categoriasFiltradasTitulo: any[] = [];
  
  // Campos de estado físico e edição removidos (não enviados ao backend)
  
  novoTitulo = {
    nome: '',
    descricao: '',
    idsCategorias: [] as number[],
    idsAutores: [] as number[]
  };

  novoAutor = {
    nome: ''
  };

  novaEditora = {
    nome: ''
  };

  novoIdioma = {
    nome: ''
  };

  novaCategoria = {
    nome: ''
  };

  livro = {
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

  ngOnInit(): void {
    this.carregarTitulos();
    this.carregarAutores();
    this.carregarEditoras();
    this.carregarIdiomas();
    this.carregarCategorias();
  }

  carregarTitulos(): void {
    this.carregandoTitulos = true;
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('[Livro] Token não encontrado');
      this.carregandoTitulos = false;
      alert('Token de autenticação não encontrado.');
      return;
    }
    
    this.getService.getApiUrlGetTitulosAtivos(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.titulos = response?.conteudo || [];
        this.carregandoTitulos = false;
        console.log('[Livro] Títulos carregados:', this.titulos);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar títulos:', err);
        this.carregandoTitulos = false;
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        alert('Erro ao carregar lista de títulos.');
      }
    });
  }

  carregarAutores(): void {
    this.carregandoAutores = true;
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('[Livro] Token não encontrado');
      this.carregandoAutores = false;
      alert('Token de autenticação não encontrado.');
      return;
    }
    
    this.getService.getApiUrlGetAutoresAtivos(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.autores = response?.conteudo || [];
        this.autoresFiltrados = [...this.autores];
        this.carregandoAutores = false;
        console.log('[Livro] Autores carregados:', this.autores);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar autores:', err);
        this.carregandoAutores = false;
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        alert('Erro ao carregar lista de autores.');
      }
    });
  }

  carregarEditoras(): void {
    this.carregandoEditoras = true;
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('[Livro] Token não encontrado');
      this.carregandoEditoras = false;
      alert('Token de autenticação não encontrado.');
      return;
    }
    
    this.getService.getApiUrlGetEditorasAtivas(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.editoras = response?.conteudo || [];
        this.editorasFiltradas = [...this.editoras];
        this.carregandoEditoras = false;
        console.log('[Livro] Editoras carregadas:', this.editoras);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar editoras:', err);
        this.carregandoEditoras = false;
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        alert('Erro ao carregar lista de editoras.');
      }
    });
  }

  carregarIdiomas(): void {
    this.carregandoIdiomas = true;
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('[Livro] Token não encontrado');
      this.carregandoIdiomas = false;
      alert('Token de autenticação não encontrado.');
      return;
    }
    
    this.getService.getApiUrlGetIdiomasAtivos(token).subscribe({
      next: (idiomas: any) => {
        this.idiomas = Array.isArray(idiomas) ? idiomas : [];
        this.idiomasFiltrados = [...this.idiomas];
        this.carregandoIdiomas = false;
        console.log('[Livro] Idiomas carregados:', this.idiomas);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar idiomas:', err);
        this.carregandoIdiomas = false;
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        alert('Erro ao carregar lista de idiomas.');
      }
    });
  }

  carregarCategorias(): void {
    this.carregandoCategorias = true;
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      console.error('[Livro] Token não encontrado');
      this.carregandoCategorias = false;
      alert('Token de autenticação não encontrado.');
      return;
    }
    
    this.getService.getApiUrlGetCategoriasAtivas(token, 0, 1000).subscribe({
      next: (response: any) => {
        this.categorias = response?.conteudo || [];
        this.categoriasFiltradas = [...this.categorias];
        this.carregandoCategorias = false;
        console.log('[Livro] Categorias carregadas:', this.categorias);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar categorias:', err);
        this.carregandoCategorias = false;
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        alert('Erro ao carregar lista de categorias.');
      }
    });
  }

  onTituloChange(value: string): void {
    if (value === 'novo') {
      this.mostrarModalTitulo = true;
      this.tituloSelecionado = '';
    } else {
      this.tituloSelecionado = value;
      this.livro.idTitulo = value ? Number(value) : null;
      
      // Se um título foi selecionado, preenche automaticamente autores e categorias
      if (value) {
        const tituloSelecionado = this.titulos.find(t => t.idTitulo === Number(value));
        if (tituloSelecionado) {
          // Preenche autores do título
          this.autoresSelecionados = tituloSelecionado.autores.map((a: any) => a.idAutor);
          
          // Preenche categorias do título
          this.categoriasSelecionadas = tituloSelecionado.categorias.map((c: any) => c.idCategoria);
        }
      } else {
        // Se nenhum título está selecionado, limpa as seleções
        this.autoresSelecionados = [];
        this.categoriasSelecionadas = [];
      }
    }
  }

  onAutorChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovoAutor();
    }
  }

  toggleAutor(idAutor: number): void {
    // Bloqueia alteração se um título estiver selecionado
    if (this.tituloSelecionado && this.tituloSelecionado !== '') {
      return;
    }
    
    const index = this.autoresSelecionados.indexOf(idAutor);
    if (index > -1) {
      this.autoresSelecionados.splice(index, 1);
    } else {
      this.autoresSelecionados.push(idAutor);
    }
  }

  isAutorSelecionado(idAutor: number): boolean {
    return this.autoresSelecionados.includes(idAutor);
  }

  onEditoraChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovaEditora();
      this.editoraSelecionada = '';
    } else {
      this.editoraSelecionada = value;
      this.livro.idEditora = value ? Number(value) : null;
    }
  }

  onIdiomaChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovoIdioma();
      this.idiomaSelecionado = '';
    } else {
      this.idiomaSelecionado = value;
      this.livro.idIdioma = value ? Number(value) : null;
    }
  }

  onCategoriaChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovaCategoria();
    }
  }

  toggleCategoria(idCategoria: number): void {
    // Bloqueia alteração se um título estiver selecionado
    if (this.tituloSelecionado && this.tituloSelecionado !== '') {
      return;
    }
    
    const index = this.categoriasSelecionadas.indexOf(idCategoria);
    if (index > -1) {
      this.categoriasSelecionadas.splice(index, 1);
    } else {
      this.categoriasSelecionadas.push(idCategoria);
    }
  }

  isCategoriaSelecionada(idCategoria: number): boolean {
    return this.categoriasSelecionadas.includes(idCategoria);
  }

  onImagemChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Validação do tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        event.target.value = '';
        return;
      }

      // Validação do tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        alert('A imagem deve ter no máximo 5MB.');
        event.target.value = '';
        return;
      }

      // Armazena o arquivo diretamente
      this.livro.imagemFile = file;
      console.log('[Livro] Imagem carregada com sucesso:', file.name);
    } else {
      this.livro.imagemFile = null;
    }
  }

  filtrarAutores(): void {
    const termo = this.termoBuscaAutor.toLowerCase().trim();
    if (!termo) {
      this.autoresFiltrados = [...this.autores];
      return;
    }
    this.autoresFiltrados = this.autores.filter(autor =>
      autor.nome?.toLowerCase().includes(termo)
    );
  }

  filtrarEditoras(): void {
    const termo = this.termoBuscaEditora.toLowerCase().trim();
    if (!termo) {
      this.editorasFiltradas = [...this.editoras];
      return;
    }
    this.editorasFiltradas = this.editoras.filter(editora =>
      editora.nome?.toLowerCase().includes(termo)
    );
  }

  filtrarIdiomas(): void {
    const termo = this.termoBuscaIdioma.toLowerCase().trim();
    if (!termo) {
      this.idiomasFiltrados = [...this.idiomas];
      return;
    }
    this.idiomasFiltrados = this.idiomas.filter(idioma =>
      idioma.nome?.toLowerCase().includes(termo)
    );
  }

  filtrarCategorias(): void {
    const termo = this.termoBuscaCategoria.toLowerCase().trim();
    if (!termo) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }
    this.categoriasFiltradas = this.categorias.filter(categoria =>
      categoria.nome?.toLowerCase().includes(termo)
    );
  }

  filtrarAutoresTitulo(): void {
    const termo = this.termoBuscaAutorTitulo.toLowerCase().trim();
    if (!termo) {
      this.autoresFiltradosTitulo = [...this.autores];
      return;
    }
    this.autoresFiltradosTitulo = this.autores.filter(autor =>
      autor.nome?.toLowerCase().includes(termo)
    );
  }

  filtrarCategoriasTitulo(): void {
    const termo = this.termoBuscaCategoriaTitulo.toLowerCase().trim();
    if (!termo) {
      this.categoriasFiltradasTitulo = [...this.categorias];
      return;
    }
    this.categoriasFiltradasTitulo = this.categorias.filter(categoria =>
      categoria.nome?.toLowerCase().includes(termo)
    );
  }

  abrirModalNovoTitulo(): void {
    this.mostrarModalTitulo = true;
    this.novoTitulo = { nome: '', descricao: '', idsCategorias: [], idsAutores: [] };
    this.termoBuscaAutorTitulo = '';
    this.termoBuscaCategoriaTitulo = '';
    this.autoresFiltradosTitulo = [...this.autores];
    this.categoriasFiltradasTitulo = [...this.categorias];
  }

  fecharModalTitulo(): void {
    this.mostrarModalTitulo = false;
    this.novoTitulo = { nome: '', descricao: '', idsCategorias: [], idsAutores: [] };
  }

  toggleAutorNoTitulo(idAutor: number): void {
    const index = this.novoTitulo.idsAutores.indexOf(idAutor);
    if (index > -1) {
      this.novoTitulo.idsAutores.splice(index, 1);
    } else {
      this.novoTitulo.idsAutores.push(idAutor);
    }
  }

  toggleCategoriaNoTitulo(idCategoria: number): void {
    const index = this.novoTitulo.idsCategorias.indexOf(idCategoria);
    if (index > -1) {
      this.novoTitulo.idsCategorias.splice(index, 1);
    } else {
      this.novoTitulo.idsCategorias.push(idCategoria);
    }
  }

  isAutorSelecionadoNoTitulo(idAutor: number): boolean {
    return this.novoTitulo.idsAutores.includes(idAutor);
  }

  isCategoriaSelecionadaNoTitulo(idCategoria: number): boolean {
    return this.novoTitulo.idsCategorias.includes(idCategoria);
  }

  salvarNovoTitulo(): void {
    const nome = this.novoTitulo.nome.trim();
    const descricao = this.novoTitulo.descricao.trim();
    if (!nome) {
      alert('Por favor, informe o nome do título.');
      return;
    }
    if (!descricao) {
      alert('Por favor, informe a descrição do título.');
      return;
    }
    if (this.novoTitulo.idsAutores.length === 0) {
      alert('Por favor, selecione pelo menos um autor.');
      return;
    }
    if (this.novoTitulo.idsCategorias.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || undefined;
    const payload: any = {
      nome,
      descricao,
      idsAutores: this.novoTitulo.idsAutores,
      idsCategorias: this.novoTitulo.idsCategorias
    };

    console.log('[Livro] Cadastrando novo título:', payload);
    
    this.apiService.postTitulo(payload, token).subscribe({
      next: (tituloNovo) => {
        console.log('[Livro] Título cadastrado com sucesso:', tituloNovo);
        alert('Título cadastrado com sucesso!');
        this.fecharModalTitulo();
        this.carregarTitulos(); 
        
        if (tituloNovo?.idTitulo) {
          this.tituloSelecionado = tituloNovo.idTitulo;
          this.livro.idTitulo = tituloNovo.idTitulo;
        }
      },
      error: (err) => {
        const backend = err?.error;
        console.error('[Livro] Erro ao cadastrar título:', err, backend);
        const msg = backend?.mensagem || backend?.message || backend?.error || backend?.errors?.[0]?.defaultMessage || 'Erro ao cadastrar título. Tente novamente.';
        alert(msg);
      }
    });
  }

  fecharModalAutor(): void {
    this.mostrarModalAutor = false;
    this.novoAutor = { nome: '' };
  }

  abrirModalNovoAutor(): void {
    this.mostrarModalAutor = true;
    this.novoAutor = { nome: '' };
  }

  salvarNovoAutor(): void {
    const nome = this.novoAutor.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome do autor.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autentica\u00e7\u00e3o n\u00e3o encontrado.');
      return;
    }

    const payload = { nome };
    console.log('[Livro] Cadastrando novo autor:', payload);
    
    this.apiService.postAutor(payload, token).subscribe({
      next: (autorNovo: any) => {
        console.log('[Livro] Autor cadastrado com sucesso:', autorNovo);
        alert('Autor cadastrado com sucesso!');
        this.fecharModalAutor();
        this.carregarAutores();
        
        if (autorNovo?.idAutor || autorNovo?.id) {
          const id = autorNovo.idAutor || autorNovo.id;
          this.autoresSelecionados.push(id);
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar autor:', err);
        alert('Erro ao cadastrar autor. Tente novamente.');
      }
    });
  }

  abrirModalNovaEditora(): void {
    this.mostrarModalEditora = true;
    this.novaEditora = { nome: '' };
  }

  fecharModalEditora(): void {
    this.mostrarModalEditora = false;
    this.novaEditora = { nome: '' };
  }

  salvarNovaEditora(): void {
    const nome = this.novaEditora.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome da editora.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autentica\u00e7\u00e3o n\u00e3o encontrado.');
      return;
    }

    const payload = { nome };
    console.log('[Livro] Cadastrando nova editora:', payload);
    
    this.apiService.postEditora(payload, token).subscribe({
      next: (editoraNova: any) => {
        console.log('[Livro] Editora cadastrada com sucesso:', editoraNova);
        alert('Editora cadastrada com sucesso!');
        this.fecharModalEditora();
        this.carregarEditoras();
        
        if (editoraNova?.idEditora || editoraNova?.id) {
          const id = editoraNova.idEditora || editoraNova.id;
          this.editoraSelecionada = id;
          this.livro.idEditora = id;
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar editora:', err);
        alert('Erro ao cadastrar editora. Tente novamente.');
      }
    });
  }

  abrirModalNovoIdioma(): void {
    this.mostrarModalIdioma = true;
    this.novoIdioma = { nome: '' };
  }

  fecharModalIdioma(): void {
    this.mostrarModalIdioma = false;
    this.novoIdioma = { nome: '' };
  }

  salvarNovoIdioma(): void {
    const nome = this.novoIdioma.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome do idioma.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autentica\u00e7\u00e3o n\u00e3o encontrado.');
      return;
    }

    const payload = { nome };
    console.log('[Livro] Cadastrando novo idioma:', payload);
    
    this.apiService.postIdioma(payload, token).subscribe({
      next: (idiomaNovo: any) => {
        console.log('[Livro] Idioma cadastrado com sucesso:', idiomaNovo);
        alert('Idioma cadastrado com sucesso!');
        this.fecharModalIdioma();
        this.carregarIdiomas();
        
        if (idiomaNovo?.idIdioma || idiomaNovo?.id) {
          const id = idiomaNovo.idIdioma || idiomaNovo.id;
          this.idiomaSelecionado = id;
          this.livro.idIdioma = id;
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar idioma:', err);
        alert('Erro ao cadastrar idioma. Tente novamente.');
      }
    });
  }

  abrirModalNovaCategoria(): void {
    this.mostrarModalCategoria = true;
    this.novaCategoria = { nome: '' };
  }

  fecharModalCategoria(): void {
    this.mostrarModalCategoria = false;
    this.novaCategoria = { nome: '' };
  }

  salvarNovaCategoria(): void {
    const nome = this.novaCategoria.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome da categoria.');
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autentica\u00e7\u00e3o n\u00e3o encontrado.');
      return;
    }

    const payload = { nome };
    console.log('[Livro] Cadastrando nova categoria:', payload);
    
    this.apiService.postCategoria(payload, token).subscribe({
      next: (categoriaNova: any) => {
        console.log('[Livro] Categoria cadastrada com sucesso:', categoriaNova);
        alert('Categoria cadastrada com sucesso!');
        this.fecharModalCategoria();
        this.carregarCategorias();
        
        if (categoriaNova?.idCategoria || categoriaNova?.id) {
          const id = categoriaNova.idCategoria || categoriaNova.id;
          this.categoriasSelecionadas.push(id);
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar categoria:', err);
        alert('Erro ao cadastrar categoria. Tente novamente.');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form && form.valid) {
      if (!this.livro.idTitulo) {
        alert('Selecione um título.');
        return;
      }
      if (this.autoresSelecionados.length === 0) {
        alert('Selecione pelo menos um autor.');
        return;
      }
      if (this.categoriasSelecionadas.length === 0) {
        alert('Selecione pelo menos uma categoria.');
        return;
      }
      if (!this.livro.idEditora || !this.livro.idIdioma) {
        alert('Selecione editora e idioma.');
        return;
      }
      if (!this.livro.descricaoEdicao || String(this.livro.descricaoEdicao).trim() === '') {
        alert('Informe a descrição da edição do livro.');
        return;
      }
      if (!this.livro.dataPublicacao) {
        alert('Informe a data de publicação.');
        return;
      }
      if (this.livro.qtdPaginas == null || this.livro.qtdPaginas <= 0) {
        alert('Informe um número de páginas válido.');
        return;
      }
      if (!this.livro.tipoCapa) {
        alert('Selecione o tipo de capa.');
        return;
      }
      if (!this.livro.tamanho) {
        alert('Selecione o tamanho do livro.');
        return;
      }
      if (!this.livro.classificacao) {
        alert('Selecione a classificação indicativa.');
        return;
      }

      const mapTipoCapa: any = {
        'dura': 'DURA',
        'flexivel': 'MOLE',
      };
      const tipoCapa = mapTipoCapa[this.livro.tipoCapa] || this.livro.tipoCapa.toUpperCase();

      // Cria o objeto JSON para o campo "edicao"
      const edicaoData = {
        descricaoEdicao: String(this.livro.descricaoEdicao).trim(),
        tipoCapa: tipoCapa,
        qtdPaginas: this.livro.qtdPaginas,
        tamanho: this.livro.tamanho.toUpperCase(),
        classificacao: this.livro.classificacao.toUpperCase(),
        dtPublicacao: this.livro.dataPublicacao,
        tituloId: this.livro.idTitulo,
        editoraId: this.livro.idEditora,
        idiomaId: this.livro.idIdioma
      };

      // Cria FormData para enviar multipart/form-data
      const formData = new FormData();
      
      // Adiciona o JSON como Blob com tipo application/json no campo "edicao"
      const edicaoBlob = new Blob([JSON.stringify(edicaoData)], { type: 'application/json' });
      formData.append('edicao', edicaoBlob);
      
      // Adiciona a imagem se foi fornecida
      if (this.livro.imagemFile) {
        formData.append('imagem', this.livro.imagemFile, this.livro.imagemFile.name);
      }

      const token = sessionStorage.getItem('authToken') || undefined;
      console.log('[Livro] Enviando cadastro de livro (FormData)');
      console.log('[Livro] Dados da edição:', edicaoData);
      console.log('[Livro] Imagem:', this.livro.imagemFile ? this.livro.imagemFile.name : 'Nenhuma');
      
      this.apiService.postLivro(formData, token).subscribe({
        next: (res) => {
          console.log('[Livro] Livro cadastrado com sucesso:', res);
          alert('Livro cadastrado com sucesso!');
          form.resetForm();
          this.cancelar();
        },
        error: (err) => {
          console.error('[Livro] Erro ao cadastrar livro:', err);
          if (err?.status === 401) {
            alert('Sessão expirada ou não autenticada. Entre novamente para continuar.');
            return;
          }
          if (AuthHelper.checkAndHandleExpiredToken(err)) return;
          const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao cadastrar livro. Tente novamente.';
          alert(msg);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  cancelar(): void {
    if (confirm('Deseja realmente cancelar? Os dados não salvos serão perdidos.')) {
      this.location.back();
    }
  }
}
