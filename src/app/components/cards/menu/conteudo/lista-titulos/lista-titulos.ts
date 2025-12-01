import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GetServicos } from '../../../../../servicos/api/get-servicos';
import { PutService } from '../../../../../servicos/api/put-service';
import { DeleteService } from '../../../../../servicos/api/delete-service';
import { Title } from '../../../../../models/title';
import { Author } from '../../../../../models/author';
import { Category } from '../../../../../models/category';
import { DecodeToken } from '../../../../../models/decode-token';

@Component({
  selector: 'app-lista-titulos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-titulos.html',
  styleUrl: './lista-titulos.css'
})
export class ListaTitulos implements OnInit {
  public titulos: Title[] = [];
  public loading = false;
  public error: string | null = null;

  private allTitulos: Title[] = [];

  // filters
  public nameQuery: string = '';
  public statusFilter: string = '';
  public availableStatuses: string[] = ['ATIVO', 'INATIVO'];

  // Pagination state
  public paginaAtual: number = 0;
  public tamanhoPagina: number = 50;
  public totalPaginas: number = 0;
  public totalElementos: number = 0;

  // modal de edição
  public mostrarModalEdicao = false;
  public tituloEditando: Title | null = null;
  public tituloEditado = {
    nome: '',
    descricao: '',
    idsAutores: [] as number[],
    idsCategorias: [] as number[]
  };

  // listas para seleção
  public autores: Author[] = [];
  public categorias: Category[] = [];
  
  // Busca e filtragem no modal
  public termoBuscaAutor = '';
  public termoBuscaCategoria = '';
  public autoresFiltrados: Author[] = [];
  public categoriasFiltradas: Category[] = [];

  constructor(
    private svc: GetServicos, 
    private router: Router,
    private http: HttpClient,
    private putService: PutService,
    private deleteService: DeleteService
  ) {}

  ngOnInit(): void {
    this.loadTitulos();
    this.carregarAutores();
    this.carregarCategorias();
  }

  private loadTitulos(): void {
    this.loading = true;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado');
      this.error = 'Token de autenticação não encontrado.';
      this.loading = false;
      return;
    }

    this.svc.getApiUrlGetTitulos(token, this.paginaAtual, this.tamanhoPagina).subscribe({
      next: (response: any) => {
        // Se a resposta vier com paginação
        if (response.conteudo) {
          this.allTitulos = response.conteudo || [];
          this.totalPaginas = response.totalPaginas || 0;
          this.totalElementos = response.totalElementos || 0;
        } else {
          // Se vier como array direto (retrocompatibilidade)
          this.allTitulos = response || [];
          this.totalPaginas = 1;
          this.totalElementos = this.allTitulos.length;
        }
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar títulos', err);
        this.error = 'Erro ao carregar títulos.';
        this.loading = false;
      }
    });
  }

  public applyFilters(): void {
    const nq = (this.nameQuery || '').trim().toLowerCase();
    const sf = (this.statusFilter || '').trim();

    let items = (this.allTitulos || []).slice();
    
    if (sf) {
      items = items.filter(i => (i.statusAtivo || '') === sf);
    }
    
    if (nq) {
      items = items.filter(i => (i.nome || '').toLowerCase().indexOf(nq) !== -1);
    }

    this.titulos = items;
  }

  public clearFilters(): void {
    this.nameQuery = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  public getAutoresNomes(titulo: Title): string {
    if (!titulo.autores || titulo.autores.length === 0) return 'N/A';
    return titulo.autores.map((a: Author) => a.nome).join(', ');
  }

  public getCategoriasNomes(titulo: Title): string {
    if (!titulo.categorias || titulo.categorias.length === 0) return 'N/A';
    return titulo.categorias.map((c: Category) => c.nome).join(', ');
  }

  private carregarAutores(): void {
    const token = sessionStorage.getItem('authToken');
    this.http.get<any>('http://localhost:8080/autores/ativos', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      params: { pagina: '0', tamanho: '1000' }
    }).subscribe({
      next: (response: any) => {
        this.autores = response?.conteudo || [];
        this.autoresFiltrados = [...this.autores];
        //console.log('Autores carregados:', this.autores);
      },
      error: (err) => {
        console.error('Erro ao carregar autores', err);
      }
    });
  }

  private carregarCategorias(): void {
    const token = sessionStorage.getItem('authToken');
    this.http.get<any>('http://localhost:8080/categorias/ativos', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      params: { pagina: '0', tamanho: '1000' }
    }).subscribe({
      next: (response: any) => {
        this.categorias = response?.conteudo || [];
        this.categoriasFiltradas = [...this.categorias];
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
      }
    });
  }

  public abrirModalEdicao(titulo: Title): void {
    this.tituloEditando = titulo;
    this.tituloEditado = {
      nome: titulo.nome,
      descricao: titulo.descricao,
      idsAutores: titulo.autores?.map(a => a.idAutor) || [],
      idsCategorias: titulo.categorias?.map(c => c.idCategoria) || []
    };
    this.termoBuscaAutor = '';
    this.termoBuscaCategoria = '';
    this.autoresFiltrados = [...this.autores];
    this.categoriasFiltradas = [...this.categorias];
    this.mostrarModalEdicao = true;
  }

  public filtrarAutores(): void {
    const termo = this.termoBuscaAutor.toLowerCase().trim();
    if (!termo) {
      this.autoresFiltrados = [...this.autores];
      return;
    }
    this.autoresFiltrados = this.autores.filter(a => 
      a.nome?.toLowerCase().includes(termo)
    );
  }

  public filtrarCategorias(): void {
    const termo = this.termoBuscaCategoria.toLowerCase().trim();
    if (!termo) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }
    this.categoriasFiltradas = this.categorias.filter(c => 
      c.nome?.toLowerCase().includes(termo)
    );
  }

  public fecharModalEdicao(): void {
    this.mostrarModalEdicao = false;
    this.tituloEditando = null;
    this.tituloEditado = {
      nome: '',
      descricao: '',
      idsAutores: [],
      idsCategorias: []
    };
  }

  public toggleAutorEdicao(idAutor: number): void {
    const index = this.tituloEditado.idsAutores.indexOf(idAutor);
    if (index > -1) {
      this.tituloEditado.idsAutores.splice(index, 1);
    } else {
      this.tituloEditado.idsAutores.push(idAutor);
    }
  }

  public toggleCategoriaEdicao(idCategoria: number): void {
    const index = this.tituloEditado.idsCategorias.indexOf(idCategoria);
    if (index > -1) {
      this.tituloEditado.idsCategorias.splice(index, 1);
    } else {
      this.tituloEditado.idsCategorias.push(idCategoria);
    }
  }

  public isAutorSelecionadoEdicao(idAutor: number): boolean {
    return this.tituloEditado.idsAutores.includes(idAutor);
  }

  public isCategoriaSelecionadaEdicao(idCategoria: number): boolean {
    return this.tituloEditado.idsCategorias.includes(idCategoria);
  }

  public salvarEdicao(): void {
    if (!this.tituloEditando) return;

    const nome = this.tituloEditado.nome.trim();
    const descricao = this.tituloEditado.descricao.trim();

    if (!nome) {
      alert('Por favor, informe o nome do título.');
      return;
    }
    if (!descricao) {
      alert('Por favor, informe a descrição do título.');
      return;
    }
    if (this.tituloEditado.idsAutores.length === 0) {
      alert('Por favor, selecione pelo menos um autor.');
      return;
    }
    if (this.tituloEditado.idsCategorias.length === 0) {
      alert('Por favor, selecione pelo menos uma categoria.');
      return;
    }

    const token = sessionStorage.getItem('authToken') || '';
    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    // Filtrar apenas autores ativos
    const idsAutoresAtivos = this.tituloEditado.idsAutores.filter(idAutor => {
      const autor = this.autores.find(a => a.idAutor === idAutor);
      return autor && autor.statusAtivo === 'ATIVO';
    });

    // Filtrar apenas categorias ativas
    const idsCategoriasAtivas = this.tituloEditado.idsCategorias.filter(idCategoria => {
      const categoria = this.categorias.find(c => c.idCategoria === idCategoria);
      return categoria && categoria.statusAtivo === 'ATIVO';
    });

    // Verificar se restaram autores e categorias após a filtragem
    if (idsAutoresAtivos.length === 0) {
      alert('Nenhum autor ativo foi selecionado. Por favor, selecione pelo menos um autor ativo.');
      return;
    }
    if (idsCategoriasAtivas.length === 0) {
      alert('Nenhuma categoria ativa foi selecionada. Por favor, selecione pelo menos uma categoria ativa.');
      return;
    }

    const payload = {
      nome,
      descricao,
      idsAutores: idsAutoresAtivos,
      idsCategorias: idsCategoriasAtivas
    };

    this.putService.atualizarTitulo(this.tituloEditando.idTitulo, payload, token).subscribe({
      next: () => {
        alert('Título atualizado com sucesso!');
        console.log('Título atualizado, payload:', payload);
        this.fecharModalEdicao();
        this.loadTitulos();
      },
      error: (err) => {
        console.error('Erro ao atualizar título:', err);
        const backend = err.error;
        let msg =
          typeof backend === 'string'
            ? backend
            : backend?.mensagem || backend?.message || JSON.stringify(backend);
        alert(msg);
      }
    });
  }

  public deletarTitulo(titulo: Title): void {
    const confirmar = confirm(`Deseja realmente excluir o título "${titulo.nome}"?`);
    if (!confirmar) return;

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    this.deleteService.deletarTitulo(titulo.idTitulo, token).subscribe({
      next: () => {
        alert('Título excluído com sucesso!');
        this.loadTitulos();
      },
      error: (err) => {
        console.error('Erro ao excluir título:', err);
        const msg = err?.error?.mensagem || err?.error?.message ||'Erro ao excluir título.';
        alert(msg);
      }
    });
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

  // Pagination methods
  public irParaPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaAtual = pagina;
      this.loadTitulos();
    }
  }

  public paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.loadTitulos();
    }
  }

  public proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.loadTitulos();
    }
  }

  public getPaginasVisiveis(): number[] {
    const maxPaginas = 5;
    const metade = Math.floor(maxPaginas / 2);
    let inicio = Math.max(0, this.paginaAtual - metade);
    let fim = Math.min(this.totalPaginas, inicio + maxPaginas);
    
    if (fim - inicio < maxPaginas) {
      inicio = Math.max(0, fim - maxPaginas);
    }
    
    const paginas: number[] = [];
    for (let i = inicio; i < fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }
}
