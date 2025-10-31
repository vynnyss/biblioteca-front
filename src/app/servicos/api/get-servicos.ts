import { Injectable } from '@angular/core';
import { BookModel } from '../../models/book-model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../../models/pessoa-model';

@Injectable({
  providedIn: 'root'
})
export class GetServicos {
  constructor(private http: HttpClient) {}
  private apiUrlGetEdicoes = "http://localhost:8080/edicoes";

  getApiUrlGetEdicoes(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(this.apiUrlGetEdicoes);
  }

  getPessoaPorEmail(email: string): Observable<Pessoa> {
    const apiUrlGetPessoaPorEmail = `http://localhost:8080/usuarios/buscar-por-email`;
    const params = new HttpParams().set('email', email);
    return this.http.get<Pessoa>(apiUrlGetPessoaPorEmail, { params });
  }
}