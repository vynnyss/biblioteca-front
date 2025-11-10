import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emprestimo } from '../../models/emprestimo';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrlLogin = "http://localhost:8080/auth/login";
  private apiUrlRegistro = "http://localhost:8080/auth/registro";
  private apiUrlEmprestimo = "http://localhost:8080/emprestimos";
  private apiUrlUsuarios = "http://localhost:8080/usuarios"; 
  private apiUrlUsuario = "http://localhost:8080/usuario";
  private apiUrlTitulos = "http://localhost:8080/titulos";  
  private apiUrlLivros = "http://localhost:8080/livros";

  constructor(private http: HttpClient){}

  postLogin(email: string, senha: string): Observable<any> {
    var payload = {
      "email": email,
      "senha": senha
    }
    return this.http.post<any>(`${this.apiUrlLogin}`, payload)
  }

  postRegistro(email: string, senha: string, funcao: string): Observable<any> {
    var payload = {
      "email": email,
      "senha": senha,
      "funcao": funcao
    }
    console.log(payload)
    return this.http.post<any>(`${this.apiUrlRegistro}`, payload)
  }
  
  postEmprestimo(payload: Emprestimo): Observable<any> {
    return this.http.post<any>(`${this.apiUrlEmprestimo}`, payload);
  }

  putUsuario(id: number, payload: any, token: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.put<any>(`${this.apiUrlUsuarios}/${id}`, payload, { headers });
  }

  postFuncionario(dados: any) {
    return this.http.post(`${this.apiUrlUsuarios}`, dados, { responseType: 'text' });
  }

  postCadastro(url: string, body: any): Observable<any> {
    return this.http.post(url, body);
  }
  getUsuarioPorId(id: number, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrlUsuarios}/${id}`, { headers });
  }


  getUsuarioMe(token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrlUsuarios}/me`, { headers });
  }


  getUsuarioPorIdSingular(id: number, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrlUsuario}/${id}`, { headers });
  }


  getUsuarioPorEmail(email: string, token: string): Observable<any> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.apiUrlUsuarios}/email/${email}`, { headers });
  }


  listarUsuarios(token: string): Observable<any[]> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrlUsuarios}`, { headers });
  }


  getTitulos(token?: string): Observable<any[]> {
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.get<any[]>(`${this.apiUrlTitulos}`, options);
  }

  postTitulo(titulo: any, token?: string): Observable<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post<any>(`${this.apiUrlTitulos}`, titulo, { headers });
  }

  postLivro(livro: any, token?: string): Observable<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post<any>(`${this.apiUrlLivros}`, livro, { headers });
  }
}
