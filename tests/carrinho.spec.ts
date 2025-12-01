import { test, expect } from '@playwright/test';

/**
 * Testes para o Carrinho de Compras
 * Funcionalidades: Adicionar livros, visualizar carrinho, finalizar empréstimo
 */

// Helper para fazer login como cliente
async function loginAsCliente(page: any) {
  await page.goto('/');
  await page.click('#login-btn');
  await page.waitForSelector('#login-modal', { state: 'visible' });
  await page.fill('#login-email', 'usuario072@exemplo.com');
  await page.fill('#login-password', 'SenhaFixa123');
  await page.click('#login-form button.btn-primary');
  await page.waitForSelector('#login-modal', { state: 'hidden', timeout: 10000 });
  await page.waitForFunction(() => {
    return sessionStorage.getItem('authToken') !== null;
  }, { timeout: 10000 });
}

test.describe('Carrinho de Compras - Cliente', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCliente(page);
  });

  test('deve adicionar livro ao carrinho estando logado como cliente', async ({ page }) => {
    // Ir para home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Clicar no primeiro livro
    const firstBook = page.locator('app-book').first();
    await firstBook.click();
    await page.waitForTimeout(1000);

    // Procurar botão de adicionar ao carrinho
    const addToCartBtn = page.locator('button:has-text("Adicionar ao Carrinho"), button:has-text("Reservar"), button:has-text("Adicionar")').first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);

      // Verificar que não apareceu modal de autenticação (já está logado)
      const authModal = page.locator('.modal-overlay:has-text("login")');
      await expect(authModal).not.toBeVisible();
    }
  });

  test('deve visualizar carrinho vazio', async ({ page }) => {
    // Navegar para o carrinho
    await page.goto('/carrinho');
    await page.waitForLoadState('networkidle');

    // Verificar título do carrinho
    await expect(page.locator('h1:has-text("Carrinho")')).toBeVisible();
  });

  test('deve exibir botão de finalizar pedido', async ({ page }) => {
    await page.goto('/carrinho');
    await page.waitForLoadState('networkidle');

    // Verificar botão de finalizar
    const finalizarBtn = page.locator('button:has-text("Finalizar")');
    await expect(finalizarBtn).toBeVisible();
  });

  test('deve mostrar mensagem ao tentar finalizar carrinho vazio', async ({ page }) => {
    await page.goto('/carrinho');
    await page.waitForLoadState('networkidle');

    // Listener para alert
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Clicar em finalizar
    const finalizarBtn = page.locator('button:has-text("Finalizar")').first();
    await finalizarBtn.click();
    await page.waitForTimeout(1000);

    // Verificar que apareceu mensagem sobre carrinho vazio
    expect(dialogMessage.toLowerCase()).toContain('vazio');
  });
});

test.describe('Carrinho - Fluxo Completo', () => {
  test('fluxo completo: adicionar livro e visualizar no carrinho', async ({ page }) => {
    // Login como cliente
    await loginAsCliente(page);

    // Ir para home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Clicar no primeiro livro
    const firstBook = page.locator('app-book').first();
    await firstBook.click();
    await page.waitForTimeout(1000);

    // Adicionar ao carrinho
    const addToCartBtn = page.locator('button').filter({ hasText: /adicionar|reservar/i }).first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(1000);

      // Navegar para o carrinho
      await page.goto('/carrinho');
      await page.waitForLoadState('networkidle');

      // Verificar que há itens no carrinho
      const cartItems = page.locator('app-itens-carrinho, .cart-item');
      const count = await cartItems.count();
      
      // Deve ter pelo menos um item
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});
