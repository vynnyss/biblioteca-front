import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrlLogin = "http://localhost:8080/auth/login";
  private apiUrlRegistro = "http://localhost:8080/auth/registro";


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
  
}
