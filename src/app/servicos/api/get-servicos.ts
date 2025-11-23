import { Injectable } from '@angular/core';
import { BookModel } from '../../models/book-model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PessoaModel } from '../../models/pessoa-model';
import { AutorModel } from '../../models/autor';
import { EditoraModel } from '../../models/editora-model';
import { ExemplarModel } from '../../models/exemplar-model';
import { ListaEmprestimoModel } from '../../models/lista-emprestimo-model';
import { EmprestimoModel } from '../../models/emprestimo-model';
import { Estado } from '../../models/estado';
import { Title } from '../../models/title';

@Injectable({
  providedIn: 'root'
})
export class GetServicos {
  constructor(private http: HttpClient) {}
  private apiUrlGetEdicoes = "http://localhost:8080/edicoes";
  private apiUrlGetEdicoesAtivas = "http://localhost:8080/edicoes/ativos";
  private apiUrlGetAutores = "http://localhost:8080/autores";
  private apiUrlGetEditoras = "http://localhost:8080/editoras";
  private apiUrlGetExemplaresDaEdicao = "http://localhost:8080/exemplares/buscar-por-edicao";

  private apiUrlGetEmprestimos = "http://localhost:8080/emprestimos";
  private apiUrlGetEstados = "http://localhost:8080/estados";
  private apiUrlGetEmprestimosPorPessoa = "http://localhost:8080/emprestimos/buscar-por-pessoa";

  private apiUrlGetClientes = "http://localhost:8080/usuarios/clientes";
  private apiUrlGetFuncionarios = "http://localhost:8080/usuarios/funcionarios";
  private apiUrlGetAdministradores = "http://localhost:8080/usuarios/administradores";
  private apiUrlGetTitulos = "http://localhost:8080/titulos";

  getApiUrlGetAutores(): Observable<AutorModel[]> {
    return this.http.get<AutorModel[]>(this.apiUrlGetAutores);
  }

  getApiUrlGetEditoras(): Observable<EditoraModel[]> {
    return this.http.get<EditoraModel[]>(this.apiUrlGetEditoras);
  }

  getApiUrlGetIdiomas(): Observable<any[]> {
    const apiUrlGetIdiomas = "http://localhost:8080/idiomas";
    return this.http.get<any[]>(apiUrlGetIdiomas);
  }

  getApiUrlGetExemplaresDaEdicao(id : number): Observable<ExemplarModel[]> {
    return this.http.get<ExemplarModel[]>(`${this.apiUrlGetExemplaresDaEdicao}/${id}`);
  }

  getApiUrlGetEmprestimos(): Observable<ListaEmprestimoModel[]> {
    return this.http.get<ListaEmprestimoModel[]>(this.apiUrlGetEmprestimos);
  }

  getApiUrlGetEmprestimosPorID(id : number): Observable<EmprestimoModel> {
    return this.http.get<EmprestimoModel>(`${this.apiUrlGetEmprestimos}/${id}`);
  }

  getApiUrlGetEmprestimosPorPessoa(idPessoa: number): Observable<ListaEmprestimoModel[]> {
    const token = sessionStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<ListaEmprestimoModel[]>(`${this.apiUrlGetEmprestimosPorPessoa}/${idPessoa}`, { headers });
  }

  getApiUrlGetFuncionarios(): Observable<PessoaModel[]> {
    return this.http.get<PessoaModel[]>(this.apiUrlGetFuncionarios);
  }

  getApiUrlGetAdministradores(): Observable<PessoaModel[]> {
    return this.http.get<PessoaModel[]>(this.apiUrlGetAdministradores);
  }

  getApiUrlGetClientes(): Observable<PessoaModel[]> {
    return this.http.get<PessoaModel[]>(this.apiUrlGetClientes);
  }

  getApiUrlGetEdicoes(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(this.apiUrlGetEdicoes);
  }

  getApiUrlGetEdicoesAtivas(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(this.apiUrlGetEdicoesAtivas);
  }

  getPessoaPorEmail(email: string): Observable<PessoaModel> {
    const apiUrlGetPessoaPorEmail = `http://localhost:8080/usuarios/buscar-por-email`;
    const params = new HttpParams().set('email', email);
    return this.http.get<PessoaModel>(apiUrlGetPessoaPorEmail, { params });
  }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.apiUrlGetEstados);
  }

  getApiUrlGetTitulos(): Observable<Title[]> {
    return this.http.get<Title[]>(this.apiUrlGetTitulos);
  }
}