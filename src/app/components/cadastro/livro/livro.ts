<<<<<<< HEAD
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-livro',
  templateUrl: './livro.html',
  styleUrls: ['./livro.css']
})
export class Livro {}
=======
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../../servicos/api/post-service';
import { Title } from '../../../models/title';

@Component({
  selector: 'app-livro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livro.html',
  styleUrls: ['./livro.css']
})
export class Livro implements OnInit {
  private apiService = inject(PostService);
  private http = inject(HttpClient);
  
  titulos: Title[] = [];
  tituloSelecionado: number | string = '';
  mostrarModalTitulo: boolean = false;
  carregandoTitulos: boolean = false;
  
  autores: any[] = [];
  autorSelecionado: number | string = '';
  mostrarModalAutor: boolean = false;
  carregandoAutores: boolean = false;
  
  editoras: any[] = [];
  editoraSelecionada: number | string = '';
  mostrarModalEditora: boolean = false;
  carregandoEditoras: boolean = false;
  
  idiomas: any[] = [];
  idiomaSelecionado: number | string = '';
  mostrarModalIdioma: boolean = false;
  carregandoIdiomas: boolean = false;
  
  categorias: any[] = [];
  categoriaSelecionada: number | string = '';
  mostrarModalCategoria: boolean = false;
  carregandoCategorias: boolean = false;
  
  estadoFisicoSelecionado: string = '';
  mostrarModalEstadoFisico: boolean = false;
  
  edicoes: any[] = [];
  edicaoSelecionada: number | string = '';
  mostrarModalEdicao: boolean = false;
  carregandoEdicoes: boolean = false;
  
  novoTitulo = {
    nome: '',
    descricao: ''
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

  novoEstadoFisico = {
    estadoFisico: '',
    qtdEstoque: 1,
    edicaoId: null as number | null
  };

  novaEdicao = {
    nome: ''
  };

  livro = {
    idTitulo: null as number | null,
    idAutor: null as number | null,
    idEditora: null as number | null,
    idIdioma: null as number | null,
    idCategoria: null as number | null,
    idEstadoFisico: null as number | null,
    idEdicao: null as number | null,
    edicaoNome: '',
    dataPublicacao: '',
    paginas: null as number | null,
    tipoCapa: '',
    estoque: null as number | null
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
    const token = sessionStorage.getItem('authToken') || undefined;
    
    this.apiService.getTitulos(token).subscribe({
      next: (titulos) => {
        this.titulos = titulos || [];
        this.carregandoTitulos = false;
        console.log('[Livro] Títulos carregados:', this.titulos);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar títulos:', err);
        this.carregandoTitulos = false;
        alert('Erro ao carregar lista de títulos.');
      }
    });
  }

  carregarAutores(): void {
    this.carregandoAutores = true;
    const token = sessionStorage.getItem('authToken');
    
    this.http.get<any[]>('http://localhost:8080/autores', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (autores: any) => {
        this.autores = Array.isArray(autores) ? autores : [];
        this.carregandoAutores = false;
        console.log('[Livro] Autores carregados:', this.autores);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar autores:', err);
        this.carregandoAutores = false;
        alert('Erro ao carregar lista de autores.');
      }
    });
  }

  carregarEditoras(): void {
    this.carregandoEditoras = true;
    const token = sessionStorage.getItem('authToken');
    
    this.http.get<any[]>('http://localhost:8080/editoras', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (editoras: any) => {
        this.editoras = Array.isArray(editoras) ? editoras : [];
        this.carregandoEditoras = false;
        console.log('[Livro] Editoras carregadas:', this.editoras);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar editoras:', err);
        this.carregandoEditoras = false;
        alert('Erro ao carregar lista de editoras.');
      }
    });
  }

  carregarIdiomas(): void {
    this.carregandoIdiomas = true;
    const token = sessionStorage.getItem('authToken');
    
    this.http.get<any[]>('http://localhost:8080/idiomas', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (idiomas: any) => {
        this.idiomas = Array.isArray(idiomas) ? idiomas : [];
        this.carregandoIdiomas = false;
        console.log('[Livro] Idiomas carregados:', this.idiomas);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar idiomas:', err);
        this.carregandoIdiomas = false;
        alert('Erro ao carregar lista de idiomas.');
      }
    });
  }

  carregarCategorias(): void {
    this.carregandoCategorias = true;
    const token = sessionStorage.getItem('authToken');
    
    this.http.get<any[]>('http://localhost:8080/categorias', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (categorias: any) => {
        this.categorias = Array.isArray(categorias) ? categorias : [];
        this.carregandoCategorias = false;
        console.log('[Livro] Categorias carregadas:', this.categorias);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar categorias:', err);
        this.carregandoCategorias = false;
        alert('Erro ao carregar lista de categorias.');
      }
    });
  }


  carregarEdicoes(): void {
    this.carregandoEdicoes = true;
    const token = sessionStorage.getItem('authToken');
    
    this.http.get<any[]>('http://localhost:8080/edicoes', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).subscribe({
      next: (edicoes: any) => {
        this.edicoes = Array.isArray(edicoes) ? edicoes : [];
        this.carregandoEdicoes = false;
        console.log('[Livro] Edições carregadas:', this.edicoes);
      },
      error: (err) => {
        console.error('[Livro] Erro ao carregar edições:', err);
        this.carregandoEdicoes = false;
        alert('Erro ao carregar lista de edições.');
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
    }
  }

  onAutorChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovoAutor();
      this.autorSelecionado = '';
    } else {
      this.autorSelecionado = value;
      this.livro.idAutor = value ? Number(value) : null;
    }
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
      this.categoriaSelecionada = '';
    } else {
      this.categoriaSelecionada = value;
      this.livro.idCategoria = value ? Number(value) : null;
    }
  }

  onEstadoFisicoChange(value: string): void {
    this.estadoFisicoSelecionado = value;
  }

  onEdicaoChange(value: string): void {
    if (value === 'novo') {
      this.abrirModalNovaEdicao();
      this.edicaoSelecionada = '';
    } else {
      this.edicaoSelecionada = value;
      this.livro.idEdicao = value ? Number(value) : null;
    }
  }

  abrirModalNovoTitulo(): void {
    this.mostrarModalTitulo = true;
    this.novoTitulo = { nome: '', descricao: '' };
  }

  fecharModalTitulo(): void {
    this.mostrarModalTitulo = false;
    this.novoTitulo = { nome: '', descricao: '' };
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

    const token = sessionStorage.getItem('authToken') || undefined;
    const payload = {
      nome,
      descricao
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
        console.error('[Livro] Erro ao cadastrar título:', err);
        alert('Erro ao cadastrar título. Tente novamente.');
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

    const payload = { nome };
    console.log('[Livro] Cadastrando novo autor:', payload);
    
    this.apiService.postCadastro('http://localhost:8080/autores', payload).subscribe({
      next: (autorNovo: any) => {
        console.log('[Livro] Autor cadastrado com sucesso:', autorNovo);
        alert('Autor cadastrado com sucesso!');
        this.fecharModalAutor();
        this.carregarAutores();
        
        if (autorNovo?.idAutor || autorNovo?.id) {
          const id = autorNovo.idAutor || autorNovo.id;
          this.autorSelecionado = id;
          this.livro.idAutor = id;
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

    const payload = { nome };
    console.log('[Livro] Cadastrando nova editora:', payload);
    
    this.apiService.postCadastro('http://localhost:8080/editoras', payload).subscribe({
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

    const payload = { nome };
    console.log('[Livro] Cadastrando novo idioma:', payload);
    
    this.apiService.postCadastro('http://localhost:8080/idiomas', payload).subscribe({
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

    const payload = { nome };
    console.log('[Livro] Cadastrando nova categoria:', payload);
    
    this.apiService.postCadastro('http://localhost:8080/categorias', payload).subscribe({
      next: (categoriaNova: any) => {
        console.log('[Livro] Categoria cadastrada com sucesso:', categoriaNova);
        alert('Categoria cadastrada com sucesso!');
        this.fecharModalCategoria();
        this.carregarCategorias();
        
        if (categoriaNova?.idCategoria || categoriaNova?.id) {
          const id = categoriaNova.idCategoria || categoriaNova.id;
          this.categoriaSelecionada = id;
          this.livro.idCategoria = id;
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar categoria:', err);
        alert('Erro ao cadastrar categoria. Tente novamente.');
      }
    });
  }

  abrirModalNovoEstadoFisico(): void {
  alert('Cadastro de novo estado físico desativado. Use opções pré-definidas.');
  }

  fecharModalEstadoFisico(): void {
    this.mostrarModalEstadoFisico = false;
    this.novoEstadoFisico = { estadoFisico: '', qtdEstoque: 1, edicaoId: null };
  }

  salvarNovoEstadoFisico(): void {
    alert('Cadastro de novo estado físico desativado. Use as opções pré-definidas.');
    this.fecharModalEstadoFisico();
  }

  abrirModalNovaEdicao(): void {
    this.mostrarModalEdicao = true;
    this.novaEdicao = { nome: '' };
  }

  fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.novaEdicao = { nome: '' };
  }

  salvarNovaEdicao(): void {
    const nome = this.novaEdicao.nome.trim();
    if (!nome) {
      alert('Por favor, informe o nome da edição.');
      return;
    }

    const payload = { nome };
    console.log('[Livro] Cadastrando nova edição:', payload);
    
    this.apiService.postCadastro('http://localhost:8080/edicoes', payload).subscribe({
      next: (edicaoNova: any) => {
        console.log('[Livro] Edição cadastrada com sucesso:', edicaoNova);
        alert('Edição cadastrada com sucesso!');
        this.fecharModalEdicao();
        this.carregarEdicoes();
        
        if (edicaoNova?.idEdicao || edicaoNova?.id) {
          const id = edicaoNova.idEdicao || edicaoNova.id;
          this.edicaoSelecionada = id;
          this.livro.idEdicao = id;
        }
      },
      error: (err) => {
        console.error('[Livro] Erro ao cadastrar edição:', err);
        alert('Erro ao cadastrar edição. Tente novamente.');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form && form.valid) {
      if (!this.livro.idTitulo || !this.livro.idAutor || !this.livro.idEditora || !this.livro.idIdioma || !this.livro.idCategoria) {
        alert('Selecione título, autor, editora, idioma e categoria.');
        return;
      }
      if (!this.livro.edicaoNome || String(this.livro.edicaoNome).trim() === '') {
        alert('Informe a edição do livro.');
        return;
      }
      if (!this.livro.dataPublicacao) {
        alert('Informe a data de publicação.');
        return;
      }
      if (this.livro.paginas == null || this.livro.paginas <= 0) {
        alert('Informe um número de páginas válido.');
        return;
      }
      if (!this.livro.tipoCapa) {
        alert('Selecione o tipo de capa.');
        return;
      }
      if (this.livro.estoque == null || this.livro.estoque < 0) {
        alert('Informe um estoque válido (0 ou mais).');
        return;
      }
      if (!this.estadoFisicoSelecionado) {
        alert('Selecione o estado físico.');
        return;
      }

      const mapEstado: any = {
        'MUITO_RUIM': 'MUITO_RUIM',
        'RUIM': 'RUIM',
        'BOM': 'BOM',
        'OTIMO': 'OTIMO',
        'EXCELENTE': 'EXCELENTE'
      };
      const estadoFisico = mapEstado[this.estadoFisicoSelecionado] || 'BOM';

      const payload = {
        idTitulo: this.livro.idTitulo,
        idAutor: this.livro.idAutor,
        idEditora: this.livro.idEditora,
        idIdioma: this.livro.idIdioma,
        idCategoria: this.livro.idCategoria,
        edicaoNome: String(this.livro.edicaoNome).trim(),
        dataPublicacao: this.livro.dataPublicacao,
        paginas: this.livro.paginas,
        tipoCapa: this.livro.tipoCapa,
        estoque: this.livro.estoque,
        estadoFisico
      };

      const token = sessionStorage.getItem('authToken') || undefined;
      console.log('[Livro] Enviando cadastro de livro:', payload);
      this.apiService.postLivro(payload, token).subscribe({
        next: (res) => {
          console.log('[Livro] Livro cadastrado com sucesso:', res);
          alert('Livro cadastrado com sucesso!');
          form.resetForm();
          this.cancelar();
        },
        error: (err) => {
          console.error('[Livro] Erro ao cadastrar livro:', err);
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
      this.livro = {
        idTitulo: null,
        idAutor: null,
        idEditora: null,
        idIdioma: null,
        idCategoria: null,
        idEstadoFisico: null,
        idEdicao: null,
        edicaoNome: '',
        dataPublicacao: '',
        paginas: null,
        tipoCapa: '',
        estoque: null
      };
      this.tituloSelecionado = '';
      this.autorSelecionado = '';
      this.editoraSelecionada = '';
      this.idiomaSelecionado = '';
      this.categoriaSelecionada = '';
      this.estadoFisicoSelecionado = '';
      this.edicaoSelecionada = '';
    }
  }
}
>>>>>>> origin/dev
