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
}
