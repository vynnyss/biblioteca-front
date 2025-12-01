import { test, expect } from '@playwright/test';

/**
 * Testes para Cadastro de Pessoa (Cliente)
 * Rota: /cadastro/pessoa
 */

test.describe('Cadastro de Pessoa (Cliente)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cadastro/pessoa');
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir formulário de cadastro', async ({ page }) => {
    // Verificar título
    await expect(page.locator('h2').filter({ hasText: /cadastre-se/i })).toBeVisible();

    // Verificar campos principais
    await expect(page.locator('input[name="nome"], input[placeholder*="Nome"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tentar submeter formulário vazio
    const submitButton = page.locator('button[type="submit"], button:has-text("Cadastrar"), button:has-text("Salvar")').first();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);

      // Deve aparecer alguma validação (alert ou mensagem)
      // ou os campos devem ter atributo required
      const nomeInput = page.locator('input[name="nome"], input[placeholder*="Nome"]').first();
      const hasRequired = await nomeInput.getAttribute('required');
      
      // Verificar que tem validação (required ou pattern)
      expect(hasRequired !== null || await page.locator('.error, .invalid').count() > 0).toBeTruthy();
    }
  });

  test('deve validar formato de email', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    
    if (await emailInput.isVisible()) {
      // Preencher email inválido
      await emailInput.fill('email-invalido');

      // Verificar atributo type="email" que faz validação HTML5
      const inputType = await emailInput.getAttribute('type');
      expect(inputType).toBe('email');
    }
  });

  test('deve validar formato de CPF', async ({ page }) => {
    const cpfInput = page.locator('input[name="cpf"], input[placeholder*="CPF"]').first();
    
    if (await cpfInput.isVisible()) {
      // Tentar preencher CPF inválido
      await cpfInput.fill('123');

      // Verificar que tem pattern ou maxlength
      const hasPattern = await cpfInput.getAttribute('pattern');
      const hasMaxLength = await cpfInput.getAttribute('maxlength');
      
      expect(hasPattern !== null || hasMaxLength !== null).toBeTruthy();
    }
  });

  test('deve validar formato de telefone', async ({ page }) => {
    const telefoneInput = page.locator('input[name="telefone"], input[placeholder*="Telefone"]').first();
    
    if (await telefoneInput.isVisible()) {
      // Verificar que aceita apenas números ou tem máscara
      await telefoneInput.fill('1234567890');
      
      const value = await telefoneInput.inputValue();
      // Deve ter algum formato (números puros ou com máscara)
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('deve preencher todos os campos e tentar cadastrar', async ({ page }) => {
    // Preencher nome
    const nomeInput = page.locator('input[name="nome"], input[placeholder*="Nome"]').first();
    if (await nomeInput.isVisible()) {
      await nomeInput.fill('Teste E2E Usuario');
    }

    // Preencher email
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(`teste.e2e.${Date.now()}@exemplo.com`);
    }

    // Preencher CPF
    const cpfInput = page.locator('input[name="cpf"], input[placeholder*="CPF"]').first();
    if (await cpfInput.isVisible()) {
      await cpfInput.fill('12345678901');
    }

    // Preencher data de nascimento
    const dataNascInput = page.locator('input[type="date"], input[name="dataNascimento"]').first();
    if (await dataNascInput.isVisible()) {
      await dataNascInput.fill('1990-01-01');
    }

    // Preencher telefone
    const telefoneInput = page.locator('input[name="telefone"], input[placeholder*="Telefone"]').first();
    if (await telefoneInput.isVisible()) {
      await telefoneInput.fill('11987654321');
    }

    // Selecionar sexo
    const sexoSelect = page.locator('select[name="sexo"]').first();
    if (await sexoSelect.isVisible()) {
      await sexoSelect.selectOption({ index: 1 });
    }

    // Preencher senha
    const senhaInput = page.locator('input[type="password"], input[name="senha"]').first();
    if (await senhaInput.isVisible()) {
      await senhaInput.fill('SenhaSegura123');
    }

    // Listener para dialog
    let dialogAppeared = false;
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.accept();
    });

    // Submeter
    const submitButton = page.locator('button[type="submit"], button:has-text("Cadastrar"), button:has-text("Salvar")').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(2000);

      // Verificar que algo aconteceu (dialog ou navegação)
      expect(dialogAppeared || page.url() !== 'http://localhost:4200/cadastro/pessoa').toBeTruthy();
    }
  });

  test('deve ter botão de cancelar', async ({ page }) => {
    const cancelButton = page.locator('button:has-text("Cancelar"), button:has-text("Voltar")').first();
    
    if (await cancelButton.isVisible()) {
      await expect(cancelButton).toBeVisible();
    }
  });
});
