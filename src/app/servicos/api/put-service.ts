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

  registrarSeparacao(id: number) {
    return this.http.put(`${this.apiRegistrarSeparacao}/${id}`, {});
  }

  registrarRetirada(id: number) {
    return this.http.put(`${this.apiRegistrarRetirada}/${id}`, {});
  }

  registrarDevolucao(id: number) {
    return this.http.put(`${this.apiRegistrarDevolucao}/${id}`, {});
  }

  aprovarConta(id: number) {
    return this.http.put(`${this.apiAprovarConta}/${id}`, {});
  }

  rejeitarConta(id: number, motivo: string) {
    return this.http.put(`${this.apiRejeitarConta}/${id}`, { motivo });
  }

  solicitarExclusaoConta(id: number, motivo: string) {
    return this.http.put(`${this.apiSolicitarExclusao}/${id}`, { motivo });
  }

  solicitarExclusaoExemplar(id: number) {
    return this.http.put(`${this.apiSolicitarExclusaoExemplar}/${id}`, {});
  }

  atualizarNomeAutor(id: number, nome: string) {
    return this.http.put(`${this.apiAutores}/${id}`, { "nome": nome });
  }

  atualizarNomeEditora(id: number, nome: string) {
    return this.http.put(`${this.apiEditoras}/${id}`, { "nome": nome });
  }
}
