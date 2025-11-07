import { Injectable } from '@angular/core';
import { BookModel } from '../../models/book-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PessoaModel } from '../../models/pessoa-model';
import { AutorModel } from '../../models/autor';
import { EditoraModel } from '../../models/editora-model';
import { ExemplarModel } from '../../models/exemplar-model';
import { ListaEmprestimoModel } from '../../models/lista-emprestimo-model';
import { EmprestimoModel } from '../../models/emprestimo-model';

@Injectable({
  providedIn: 'root'
})
export class GetServicos {
  constructor(private http: HttpClient) {}
  private apiUrlGetEdicoes = "http://localhost:8080/edicoes";
  private apiUrlGetAutores = "http://localhost:8080/autores";
  private apiUrlGetEditoras = "http://localhost:8080/editoras";
  private apiUrlGetExemplaresDaEdicao = "http://localhost:8080/exemplares/buscar-por-edicao";

  private apiUrlGetEmprestimos = "http://localhost:8080/emprestimos";

  private apiUrlGetClientes = "http://localhost:8080/usuarios/clientes";
  private apiUrlGetFuncionarios = "http://localhost:8080/usuarios/funcionarios";
  private apiUrlGetAdministradores = "http://localhost:8080/usuarios/administradores";

  getApiUrlGetAutores(): Observable<AutorModel[]> {
    return this.http.get<AutorModel[]>(this.apiUrlGetAutores);
  }

  getApiUrlGetEditoras(): Observable<EditoraModel[]> {
    return this.http.get<EditoraModel[]>(this.apiUrlGetEditoras);
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

  getPessoaPorEmail(email: string): Observable<PessoaModel> {
    const apiUrlGetPessoaPorEmail = `http://localhost:8080/usuarios/buscar-por-email`;
    const params = new HttpParams().set('email', email);
    return this.http.get<PessoaModel>(apiUrlGetPessoaPorEmail, { params });
  }
}