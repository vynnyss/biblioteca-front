# Testes E2E - Biblioteca Online

Este diretório contém os testes end-to-end (E2E) da aplicação Biblioteca Online usando Playwright.

## Pré-requisitos

Antes de executar os testes, certifique-se de que:

### 1. Backend está rodando
```bash
# O backend deve estar rodando em http://localhost:8080
# Navegue até o diretório do backend e inicie o servidor
```

### 2. Banco de dados configurado
O banco de dados deve conter os seguintes dados de teste:

#### Usuário de teste
- **Email**: `usuario753@exemplo.com`
- **Senha**: `SenhaFixa123`
- **Role**: ADMINISTRADOR (para testes de categorias) ou CLIENTE (para testes básicos)

#### Dados cadastrados
- Títulos de livros
- Autores
- Categorias
- Editoras
- Idiomas

### 3. Frontend
O frontend será iniciado automaticamente pelo Playwright em `http://localhost:4200` durante os testes.

## Executando os testes

### Todos os testes em todos os navegadores
```bash
npx playwright test
```

### Apenas um navegador específico
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Apenas um arquivo de teste
```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/cadastro-livro.spec.ts
npx playwright test tests/lista-categorias.spec.ts
```

### Modo interativo (UI)
```bash
npx playwright test --ui
```

### Modo debug
```bash
npx playwright test --debug
```

### Ver relatório dos últimos testes
```bash
npx playwright show-report
```

## Estrutura dos testes

### `login.spec.ts`
Testa o fluxo de autenticação:
- Login com sucesso
- Credenciais inválidas
- Validação de campos obrigatórios

### `cadastro-livro.spec.ts`
Testa o cadastro de livros:
- Cadastro completo de livro
- Validação de campos obrigatórios
- Filtros de busca (autores, categorias, títulos)
- Modais de cadastro de novo título
- Bloqueio de edição quando título selecionado
- Fluxo de cancelamento

### `lista-categorias.spec.ts`
Testa o gerenciamento de categorias:
- Listagem de categorias
- Filtros por nome e status
- Edição de categoria
- Inativação de categoria (apenas ADMINISTRADOR)
- Paginação

## Configuração

A configuração do Playwright está em `playwright.config.ts`:
- **baseURL**: `http://localhost:4200`
- **webServer**: Inicia automaticamente o servidor Angular antes dos testes
- **timeout**: 120 segundos para inicialização do servidor

## Troubleshooting

### Erro: "Cannot navigate to invalid URL"
- Verifique se o frontend está configurado para rodar em `http://localhost:4200`
- Certifique-se de que a porta 4200 não está em uso por outro processo

### Erro: "Login falhou: token não foi salvo no sessionStorage"
- **Causa**: O backend não está rodando ou não está acessível
- **Solução**: Inicie o backend em `http://localhost:8080` antes de executar os testes

### Erro: "TimeoutError: page.waitForSelector"
- **Causa**: Elementos não estão aparecendo na página (backend pode estar lento ou dados não existem)
- **Solução**: 
  - Verifique se o backend está respondendo corretamente
  - Confirme se os dados de teste existem no banco
  - Aumente o timeout se necessário

### Testes falhando por falta de dados
- Certifique-se de que o banco de dados contém:
  - O usuário de teste com as credenciais corretas
  - Dados de autores, categorias, títulos, editoras e idiomas
  - Permissões adequadas para o usuário (ADMINISTRADOR para testes de categorias)

## Debugging

Para investigar falhas nos testes:

1. **Modo UI**: Execute `npx playwright test --ui` para ver os testes em tempo real
2. **Screenshots**: Playwright tira screenshots automaticamente em falhas (pasta `test-results`)
3. **Traces**: Acesse traces detalhados com `npx playwright show-report`
4. **Debug mode**: Execute `npx playwright test --debug` para pausar e inspecionar

## CI/CD

O arquivo `.github/workflows/playwright.yml` foi gerado automaticamente e pode ser usado para executar os testes em CI/CD.

**Nota**: Para CI/CD funcionar, você precisará configurar:
- Ambiente de teste com backend e banco de dados
- Variáveis de ambiente apropriadas
- Seeds de dados de teste
