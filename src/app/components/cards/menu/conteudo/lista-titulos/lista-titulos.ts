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
    this.svc.getApiUrlGetTitulos().subscribe({
      next: (list: Title[]) => {
        this.allTitulos = list || [];
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
    this.http.get<Author[]>('http://localhost:8080/autores').subscribe({
      next: (autores) => {
        this.autores = autores || [];
      },
      error: (err) => {
        console.error('Erro ao carregar autores', err);
      }
    });
  }

  private carregarCategorias(): void {
    this.http.get<Category[]>('http://localhost:8080/categorias').subscribe({
      next: (categorias) => {
        this.categorias = categorias || [];
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
    this.mostrarModalEdicao = true;
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

    const payload = {
      nome,
      descricao,
      idsAutores: this.tituloEditado.idsAutores,
      idsCategorias: this.tituloEditado.idsCategorias
    };

    this.putService.atualizarTitulo(this.tituloEditando.idTitulo, payload).subscribe({
      next: () => {
        alert('Título atualizado com sucesso!');
        console.log('Título atualizado, payload:', payload);
        this.fecharModalEdicao();
        this.loadTitulos();
      },
      error: (err) => {
        console.error('Erro ao atualizar título:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao atualizar título.';
        alert(msg);
      }
    });
  }

  public deletarTitulo(titulo: Title): void {
    const confirmar = confirm(`Deseja realmente excluir o título "${titulo.nome}"?`);
    if (!confirmar) return;

    this.deleteService.deletarTitulo(titulo.idTitulo).subscribe({
      next: () => {
        alert('Título excluído com sucesso!');
        this.loadTitulos();
      },
      error: (err) => {
        console.error('Erro ao excluir título:', err);
        const msg = err?.error?.mensagem || err?.error?.message || 'Erro ao excluir título.';
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
}
