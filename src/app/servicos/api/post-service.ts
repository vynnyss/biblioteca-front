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
}
