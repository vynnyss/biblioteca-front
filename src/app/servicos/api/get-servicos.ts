import { Injectable } from '@angular/core';
import { BookModel } from '../../models/book-model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private apiUrlGetEstados = "http://localhost:8080/estados/ativos";
  private apiUrlGetEmprestimosPorPessoa = "http://localhost:8080/emprestimos/buscar-por-pessoa";

  private apiUrlGetClientes = "http://localhost:8080/usuarios/clientes";
  private apiUrlGetFuncionarios = "http://localhost:8080/usuarios/funcionarios";
  private apiUrlGetAdministradores = "http://localhost:8080/usuarios/administradores";
  private apiUrlGetTitulos = "http://localhost:8080/titulos";

  getApiUrlGetAutores(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetAutores, { headers, params });
  }

  getApiUrlGetEditoras(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetEditoras, { headers, params });
  }

  getApiUrlGetIdiomas(token: string): Observable<any[]> {
    const apiUrlGetIdiomas = "http://localhost:8080/idiomas";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any[]>(apiUrlGetIdiomas, { headers });
  }

  getApiUrlGetExemplaresDaEdicao(id : number, token: string): Observable<ExemplarModel[]> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<ExemplarModel[]>(`${this.apiUrlGetExemplaresDaEdicao}/${id}`, { headers });
  }

  getApiUrlGetEmprestimos(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetEmprestimos, { headers, params });
  }

  getApiUrlGetEmprestimosPorID(id : number, token: string): Observable<EmprestimoModel> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<EmprestimoModel>(`${this.apiUrlGetEmprestimos}/${id}`, { headers });
  }

  getApiUrlGetEmprestimosPorPessoa(idPessoa: number, token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(`${this.apiUrlGetEmprestimosPorPessoa}/${idPessoa}`, { headers, params });
  }

  getEmprestimosPorEmail(email: string, token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const apiUrlGetEmprestimosPorEmail = "http://localhost:8080/emprestimos/buscar-por-email";
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('email', email)
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(apiUrlGetEmprestimosPorEmail, { headers, params });
  }

  getApiUrlGetFuncionarios(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetFuncionarios, { headers, params });
  }

  getApiUrlGetAdministradores(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetAdministradores, { headers, params });
  }

  getApiUrlGetClientes(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetClientes, { headers, params });
  }

  getApiUrlGetEdicoes(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetEdicoes, { headers, params });
  }

  getApiUrlGetEdicoesAtivas(pagina: number = 0, tamanho: number = 50): Observable<any> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetEdicoesAtivas, { params });
  }

  getPessoaPorEmail(email: string, token: string): Observable<PessoaModel> {
    const apiUrlGetPessoaPorEmail = `http://localhost:8080/usuarios/buscar-por-email`;
    const params = new HttpParams().set('email', email);
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<PessoaModel>(apiUrlGetPessoaPorEmail, { params, headers });
  }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.apiUrlGetEstados);
  }

  getApiUrlGetTitulos(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(this.apiUrlGetTitulos, { headers, params });
  }

  filtrarEdicoes(termo: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const apiUrlFiltrar = "http://localhost:8080/edicoes/filtrar";
    const params = new HttpParams()
      .set('q', termo)
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(apiUrlFiltrar, { params });
  }

  getApiUrlGetCategorias(token: string, pagina: number = 0, tamanho: number = 50): Observable<any> {
    const apiUrlGetCategorias = "http://localhost:8080/categorias";
    const headers = { 'Authorization': `Bearer ${token}` };
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanho', tamanho.toString());
    return this.http.get<any>(apiUrlGetCategorias, { headers, params });
  }
}