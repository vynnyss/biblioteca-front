import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthHelper {
  /**
   * Verifica se o erro é 403 (Forbidden) e se há um token no sessionStorage.
   * Se ambas as condições forem verdadeiras, assume que o token expirou.
   * 
   * @param error O erro HTTP recebido
   * @returns true se detectar token expirado, false caso contrário
   */
  static isTokenExpired(error: any): boolean {
    const hasToken = !!sessionStorage.getItem('authToken');
    const isForbidden = error?.status === 401;
    
    // Se há token mas recebeu 401, provavelmente o token expirou
    return hasToken && isForbidden;
  }

  /**
   * Limpa os dados de autenticação e redireciona para a página inicial.
   * Exibe mensagem informando que a sessão expirou.
   */
  static handleExpiredToken(): void {
    alert('Sua sessão expirou. Por favor, faça login novamente para continuar.');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    window.location.href = '/';
  }

  /**
   * Verifica o erro e trata automaticamente se for token expirado.
   * 
   * @param error O erro HTTP recebido
   * @returns true se tratou o erro de token expirado, false caso contrário
   */
  static checkAndHandleExpiredToken(error: any): boolean {
    if (this.isTokenExpired(error)) {
      this.handleExpiredToken();
      return true;
    }
    return false;
  }
}
