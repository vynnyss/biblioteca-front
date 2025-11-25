import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PutService {
   private apiRegistrarSeparacao = "http://localhost:8080/emprestimos/registrar-separacao";
  private apiRegistrarRetirada = "http://localhost:8080/emprestimos/registrar-retirada";
  private apiRegistrarDevolucao = "http://localhost:8080/emprestimos/registrar-devolucao";
  private apiAprovarConta = "http://localhost:8080/usuarios/em-analise-aprovacao/aprovar-conta";
  private apiRejeitarConta = "http://localhost:8080/usuarios/em-analise-aprovacao/rejeitar-conta";
  private apiSolicitarExclusao = "http://localhost:8080/usuarios/solicitar-exclusao-conta";
  private apiSolicitarExclusaoExemplar = "http://localhost:8080/exemplares/solicitar-exclusao-exemplar";
  private apiAutores = "http://localhost:8080/autores";
  private apiEditoras = "http://localhost:8080/editoras";

  constructor(private http: HttpClient) {}

  registrarSeparacao(id: number, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiRegistrarSeparacao}/${id}`, {}, { headers });
  }

  registrarRetirada(id: number, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiRegistrarRetirada}/${id}`, {}, { headers });
  }

  registrarDevolucao(id: number, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiRegistrarDevolucao}/${id}`, {}, { headers });
  }

  registrarPerda(id: number, token: string) {
    const apiRegistrarPerda = "http://localhost:8080/emprestimos/registrar-perda";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiRegistrarPerda}/${id}`, {}, { headers });
  }

  aprovarConta(id: number, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiAprovarConta}/${id}`, {}, { headers });
  }

  rejeitarConta(id: number, motivo: string, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiRejeitarConta}/${id}`, { motivo }, { headers });
  }

  solicitarExclusaoConta(id: number, motivo: string, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiSolicitarExclusao}/${id}`, { motivo }, { headers });
  }

  solicitarExclusaoExemplar(id: number, motivo: string, token: string) {
    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.put(`${this.apiSolicitarExclusaoExemplar}/${id}`, { motivo }, { headers });
  }

  atualizarNomeAutor(id: number, nome: string, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiAutores}/${id}`, { "nome": nome }, { headers });
  }

  atualizarNomeEditora(id: number, nome: string, token: string) {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${this.apiEditoras}/${id}`, { "nome": nome }, { headers });
  }

  atualizarNomeIdioma(id: number, nome: string, token: string) {
    const apiIdiomas = "http://localhost:8080/idiomas";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiIdiomas}/${id}`, { "nome": nome }, { headers });
  }

  atualizarTitulo(id: number, dados: any, token: string) {
    const apiTitulos = "http://localhost:8080/titulos";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiTitulos}/${id}`, dados, { headers });
  }

  atualizarExemplar(id: number, dados: any, token: string) {
    const apiExemplares = "http://localhost:8080/exemplares";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiExemplares}/${id}`, dados, { headers });
  }

  atualizarEdicao(id: number, formData: FormData, token: string) {
    const apiEdicoes = "http://localhost:8080/edicoes";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiEdicoes}/${id}`, formData, { headers });
  }

  pagarMulta(id: number, token: string) {
    const apiPagarMulta = "http://localhost:8080/emprestimos/pagar-multa";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiPagarMulta}/${id}`, {}, { headers });
  }

  perdoarMulta(id: number, token: string) {
    const apiPerdoarMulta = "http://localhost:8080/multas/perdoar-multa";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiPerdoarMulta}/${id}`, {}, { headers });
  }

  rejeitarExclusaoConta(id: number, token: string) {
    const apiRejeitarExclusao = "http://localhost:8080/usuarios/em-analise-exclusao/rejeitar-exclusao-conta";
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.put(`${apiRejeitarExclusao}/${id}`, {}, { headers });
  }
}
