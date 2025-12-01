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

  deletarTitulo(id: number, token: string): Observable<any> {
    const apiTitulos = "http://localhost:8080/titulos";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiTitulos}/${id}`, { headers });
  }

  inativarExemplar(id: number, token: string): Observable<any> {
    const apiExemplares = "http://localhost:8080/exemplares";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiExemplares}/${id}`, { headers });
  }

  inativarEdicao(id: number, token: string): Observable<any> {
    const apiEdicoes = "http://localhost:8080/edicoes";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiEdicoes}/${id}`, { headers });
  }

  inativarAutor(id: number, token: string): Observable<any> {
    const apiAutores = "http://localhost:8080/autores";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiAutores}/${id}`, { headers });
  }

  inativarEditora(id: number, token: string): Observable<any> {
    const apiEditoras = "http://localhost:8080/editoras";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiEditoras}/${id}`, { headers });
  }

  inativarIdioma(id: number, token: string): Observable<any> {
    const apiIdiomas = "http://localhost:8080/idiomas";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiIdiomas}/${id}`, { headers });
  }

  inativarCategoria(id: number, token: string): Observable<any> {
    const apiCategorias = "http://localhost:8080/categorias";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${apiCategorias}/${id}`, { headers });
  }
}
