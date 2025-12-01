import { test, expect } from '@playwright/test';

/**
 * IMPORTANTE: Para executar estes testes, é necessário:
 * 1. Backend rodando em http://localhost:8080
 * 2. Frontend rodando em http://localhost:4200 (iniciado automaticamente pelo Playwright)
 * 3. Banco de dados configurado com o usuário de teste: usuario753@exemplo.com / SenhaFixa123
 */

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve realizar login com sucesso', async ({ page }) => {
    let loginRequestSent = false;
    let loginResponseReceived = false;
    let loginResponseStatus = 0;
    let loginResponseBody = '';
    let requestFailed = false;
    let failureReason = '';

    // Listener para capturar requisição de login
    page.on('request', request => {
      const url = request.url();
      if (url === 'http://localhost:8080/auth/login') {
        loginRequestSent = true;
        console.log('LOGIN REQUEST:', request.method(), url);
        console.log('POST DATA:', request.postData());
      }
    });

    // Listener para capturar falhas de requisição
    page.on('requestfailed', request => {
      const url = request.url();
      if (url === 'http://localhost:8080/auth/login') {
        requestFailed = true;
        failureReason = request.failure()?.errorText || 'Unknown error';
        console.log('REQUEST FAILED:', failureReason);
      }
    });

    // Listener para capturar resposta de login
    page.on('response', async response => {
      const url = response.url();
      if (url === 'http://localhost:8080/auth/login') {
        loginResponseReceived = true;
        loginResponseStatus = response.status();
        console.log('LOGIN RESPONSE:', response.status(), url);
        console.log('RESPONSE HEADERS:', JSON.stringify(response.headers(), null, 2));
        try {
          loginResponseBody = await response.text();
          console.log('RESPONSE BODY:', loginResponseBody.substring(0, 200));
        } catch (e) {
          console.log('Could not read response body:', e);
        }
      }
    });

    // Listener para capturar qualquer alert
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      console.log('DIALOG:', dialogMessage);
      await dialog.accept();
    });

    // Clicar no botão de login no header
    await page.click('#login-btn');

    // Aguardar modal abrir
    await page.waitForSelector('#login-modal', { state: 'visible' });

    // Preencher credenciais usando os IDs do modal
    await page.fill('#login-email', 'usuario753@exemplo.com');
    await page.fill('#login-password', 'SenhaFixa123');

    // Submeter formulário
    await page.click('#login-form button.btn-primary');

    // Aguardar resposta da API (com timeout maior)
    await page.waitForTimeout(3000);

    console.log('Login request sent:', loginRequestSent);
    console.log('Login response received:', loginResponseReceived);
    console.log('Login response status:', loginResponseStatus);
    console.log('Request failed:', requestFailed);
    if (requestFailed) {
      console.log('Failure reason:', failureReason);
    }

    // Se apareceu um dialog com erro, o teste deve falhar com a mensagem
    if (dialogMessage) {
      throw new Error(`Login retornou erro: ${dialogMessage}`);
    }

    // Se a requisição não foi enviada
    if (!loginRequestSent) {
      throw new Error('Requisição de login não foi enviada. Verifique o formulário.');
    }

    // Se a requisição falhou (erro de rede, CORS, etc)
    if (requestFailed) {
      throw new Error(`Requisição falhou: ${failureReason}. Pode ser problema de CORS no backend.`);
    }

    // Se não recebeu resposta
    if (!loginResponseReceived) {
      throw new Error('Não recebeu resposta do backend. Verifique se o backend está rodando.');
    }

    // Se recebeu erro do backend
    if (loginResponseStatus !== 200) {
      throw new Error(`Backend retornou erro ${loginResponseStatus}: ${loginResponseBody}`);
    }

    // Verificar se o sessionStorage foi atualizado
    const storageData = await page.evaluate(() => {
      return {
        token: sessionStorage.getItem('authToken'),
        isLogged: sessionStorage.getItem('isLogged'),
        decodedToken: sessionStorage.getItem('decodedToken')
      };
    });

    console.log('SessionStorage:', storageData);

    if (!storageData.token) {
      const modalVisible = await page.locator('#login-modal').isVisible();
      console.log('Modal ainda visível?', modalVisible);
      throw new Error('Login bem-sucedido no backend, mas token não foi salvo no sessionStorage. Verifique o componente de login.');
    }

    // Verificar se o botão de logout está visível
    await page.waitForSelector('#logout-btn', { state: 'visible', timeout: 5000 });
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    let dialogAppeared = false;
    
    // Listener para capturar o dialog
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      const message = dialog.message().toLowerCase();
      // Aceitar qualquer mensagem de erro
      expect(message.length).toBeGreaterThan(0);
      await dialog.accept();
    });

    // Clicar no botão de login
    await page.click('#login-btn');
    await page.waitForSelector('#login-modal', { state: 'visible' });

    // Preencher credenciais inválidas
    await page.fill('#login-email', 'usuario@invalido.com');
    await page.fill('#login-password', 'senhaerrada');

    // Tentar fazer login
    await page.click('#login-form button.btn-primary');

    // Aguardar um pouco para o dialog aparecer
    await page.waitForTimeout(2000);
    
    // Verificar que algum dialog apareceu
    expect(dialogAppeared).toBe(true);
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Clicar no botão de login
    await page.click('#login-btn');
    await page.waitForSelector('#login-modal', { state: 'visible' });

    // Verificar que os campos têm atributo required
    const emailInput = page.locator('#login-email');
    const passwordInput = page.locator('#login-password');
    
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });
});
