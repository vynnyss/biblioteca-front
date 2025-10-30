import { Injectable } from '@angular/core';
import { BookModel } from '../../models/bookI-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetServicos {
  constructor(private http: HttpClient) {}
  private apiUrlGetEdicoes = "http://localhost:8080/edicoes";

  getApiUrlGetEdicoes(): Observable<BookModel[]> {
    return this.http.get<BookModel[]>(this.apiUrlGetEdicoes);
  }
}