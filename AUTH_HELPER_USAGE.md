# Como Usar o AuthHelper para Detectar Token Expirado

## Problema
Após um período de inatividade, o token JWT expira no backend. Quando isso acontece, as requisições autenticadas retornam erro **403 (Forbidden)**, mesmo que o usuário tenha um token válido armazenado no `sessionStorage`.

## Solução
Foi criado o utilitário `AuthHelper` que detecta automaticamente quando um erro 403 é devido a token expirado e redireciona o usuário para fazer login novamente.

## Como Usar

### 1. Importar o AuthHelper

```typescript
import { AuthHelper } from '../../../servicos/utils/auth-helper';
```

### 2. Adicionar Verificação nos Tratamentos de Erro

**Antes:**
```typescript
error: (err) => {
  console.error('Erro ao carregar dados:', err);
  alert('Erro ao carregar dados.');
}
```

**Depois:**
```typescript
error: (err) => {
  console.error('Erro ao carregar dados:', err);
  if (AuthHelper.checkAndHandleExpiredToken(err)) return;
  alert('Erro ao carregar dados.');
}
```

### 3. Exemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { GetServicos } from '../../../servicos/api/get-servicos';
import { AuthHelper } from '../../../servicos/utils/auth-helper';

@Component({
  selector: 'app-meu-componente',
  templateUrl: './meu-componente.html'
})
export class MeuComponente implements OnInit {
  
  constructor(private getService: GetServicos) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
      alert('Token de autenticação não encontrado.');
      return;
    }

    this.getService.getApiUrlGetDados(token).subscribe({
      next: (response) => {
        console.log('Dados carregados:', response);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        
        // IMPORTANTE: Adicione esta linha em TODOS os tratamentos de erro
        // de requisições autenticadas
        if (AuthHelper.checkAndHandleExpiredToken(err)) return;
        
        // Seu tratamento de erro normal continua aqui
        const msg = err?.error?.mensagem || 'Erro ao carregar dados.';
        alert(msg);
      }
    });
  }
}
```

## Comportamento

Quando o token expira:
1. A requisição retorna erro 403
2. O `AuthHelper.checkAndHandleExpiredToken(err)` detecta que há um token mas o erro é 403
3. Exibe o alert: "Sua sessão expirou. Por favor, faça login novamente para continuar."
4. Limpa os dados de autenticação do `sessionStorage`
5. Redireciona para a página inicial (`/`)

## Componentes Já Atualizados

✅ `cadastro/livro/livro.ts`
✅ `cards/menu/conteudo/lista-emprestimos/lista-emprestimos.ts`
✅ `cards/menu/conteudo/detalhes-cliente/detalhes-cliente.ts`

## Onde Aplicar

Adicione a verificação do AuthHelper em **TODOS** os tratamentos de erro (`error: (err) => {...}`) que fazem requisições HTTP autenticadas, especialmente:

- Carregamento de listas (GET)
- Cadastros (POST)
- Atualizações (PUT)
- Exclusões/Inativações (DELETE)

## Métodos Disponíveis

### `AuthHelper.checkAndHandleExpiredToken(error: any): boolean`
**Uso recomendado**: Detecta e trata automaticamente token expirado.
- Retorna `true` se detectou token expirado (já tratou o erro)
- Retorna `false` se não é token expirado (continue o tratamento normal)

### `AuthHelper.isTokenExpired(error: any): boolean`
**Uso avançado**: Apenas verifica se é token expirado, sem tratar.
- Retorna `true` se há token mas erro é 403
- Retorna `false` caso contrário

### `AuthHelper.handleExpiredToken(): void`
**Uso interno**: Limpa sessão e redireciona para login.
- Exibe mensagem de sessão expirada
- Remove tokens do sessionStorage
- Redireciona para página inicial

## Observações

- ⚠️ **Não confundir com erro 401**: O erro 401 indica "não autenticado" (sem token), enquanto 403 com token válido indica "token expirado"
- ✅ O método `checkAndHandleExpiredToken` já faz toda a lógica necessária, basta adicionar uma linha no tratamento de erro
- 🔄 O usuário será redirecionado automaticamente para a tela de login, mantendo uma experiência consistente
