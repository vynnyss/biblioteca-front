import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  inativarUsuario(id: number, motivo: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = { motivo };
    return this.http.delete(`${this.apiUrl}/${id}`, { headers, body });
  }

  deletarTitulo(id: number): Observable<any> {
    const apiTitulos = "http://localhost:8080/titulos";
    return this.http.delete(`${apiTitulos}/${id}`);
  }

  inativarExemplar(id: number): Observable<any> {
    const apiExemplares = "http://localhost:8080/exemplares";
    return this.http.delete(`${apiExemplares}/${id}`);
  }

  inativarEdicao(id: number): Observable<any> {
    const apiEdicoes = "http://localhost:8080/edicoes";
    return this.http.delete(`${apiEdicoes}/${id}`);
  }

  inativarAutor(id: number): Observable<any> {
    const apiAutores = "http://localhost:8080/autores";
    return this.http.delete(`${apiAutores}/${id}`);
  }

  inativarEditora(id: number): Observable<any> {
    const apiEditoras = "http://localhost:8080/editoras";
    return this.http.delete(`${apiEditoras}/${id}`);
  }

  inativarIdioma(id: number): Observable<any> {
    const apiIdiomas = "http://localhost:8080/idiomas";
    return this.http.delete(`${apiIdiomas}/${id}`);
  }
}
