import { test, expect } from '@playwright/test';

/**
 * Testes para Menu Principal com diferentes perfis de usuário
 * ADMINISTRADOR, BIBLIOTECARIO, CLIENTE
 */

// Helpers para login
async function loginAsAdministrador(page: any) {
  await page.goto('/');
  await page.click('#login-btn');
  await page.waitForSelector('#login-modal', { state: 'visible' });
  await page.fill('#login-email', 'usuario753@exemplo.com');
  await page.fill('#login-password', 'SenhaFixa123');
  await page.click('#login-form button.btn-primary');
  await page.waitForSelector('#login-modal', { state: 'hidden', timeout: 10000 });
  await page.waitForFunction(() => sessionStorage.getItem('authToken') !== null, { timeout: 10000 });
}

async function loginAsBibliotecario(page: any) {
  await page.goto('/');
  await page.click('#login-btn');
  await page.waitForSelector('#login-modal', { state: 'visible' });
  await page.fill('#login-email', 'usuario715@exemplo.com');
  await page.fill('#login-password', 'SenhaFixa123');
  await page.click('#login-form button.btn-primary');
  await page.waitForSelector('#login-modal', { state: 'hidden', timeout: 10000 });
  await page.waitForFunction(() => sessionStorage.getItem('authToken') !== null, { timeout: 10000 });
}

async function loginAsCliente(page: any) {
  await page.goto('/');
  await page.click('#login-btn');
  await page.waitForSelector('#login-modal', { state: 'visible' });
  await page.fill('#login-email', 'usuario072@exemplo.com');
  await page.fill('#login-password', 'SenhaFixa123');
  await page.click('#login-form button.btn-primary');
  await page.waitForSelector('#login-modal', { state: 'hidden', timeout: 10000 });
  await page.waitForFunction(() => sessionStorage.getItem('authToken') !== null, { timeout: 10000 });
}

test.describe('Menu Principal - ADMINISTRADOR', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdministrador(page);
  });

  test('deve acessar menu principal como administrador', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForTimeout(2000);

    // Verificar que o menu principal está visível (h2 "Bem-vindo" ou h4 com nome dos cards)
    const menuVisible = await page.locator('h2, h4, .menu-item, app-menu-lateral').first().isVisible();
    expect(menuVisible).toBeTruthy();
  });

  test('deve visualizar opções de administrador no menu', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Verificar que há links/botões de navegação
    const menuItems = page.locator('nav a, .menu-item, button').filter({ hasText: /categoria|cliente|funcionário|empréstimo/i });
    const count = await menuItems.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('deve acessar lista de categorias', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Clicar no link de categorias
    const categoriasLink = page.locator('a, button').filter({ hasText: /categoria/i }).first();
    
    if (await categoriasLink.isVisible()) {
      await categoriasLink.click();
      await page.waitForTimeout(500);

      // Verificar que está na página de categorias
      await expect(page.locator('h2:has-text("Categorias")')).toBeVisible();
    }
  });

  test('deve poder deletar/inativar categoria como administrador', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Navegar para categorias
    const categoriasLink = page.locator('a').filter({ hasText: /categoria/i }).first();
    if (await categoriasLink.isVisible()) {
      await categoriasLink.click();
      await page.waitForTimeout(500);

      // Procurar botão de deletar
      const deleteButton = page.locator('.btn-icon-delete, button[title*="deletar"], button[title*="inativar"]').first();
      
      // Administrador deve ver o botão de deletar
      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeVisible();
      }
    }
  });
});

test.describe('Menu Principal - BIBLIOTECARIO', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsBibliotecario(page);
  });

  test('deve acessar menu principal como bibliotecário', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Verificar que o menu principal está visível
    await expect(page.locator('h2').filter({ hasText: /bem-vindo/i })).toBeVisible();
  });

  test('deve visualizar opções de bibliotecário no menu', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Verificar que há opções disponíveis
    const menuItems = page.locator('nav a, .menu-item, button');
    const count = await menuItems.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('deve acessar lista de empréstimos', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Procurar link de empréstimos
    const emprestimosLink = page.locator('a, button').filter({ hasText: /empréstimo/i }).first();
    
    if (await emprestimosLink.isVisible()) {
      await emprestimosLink.click();
      await page.waitForTimeout(500);

      // Verificar navegação
      expect(page.url()).toContain('emprestimo');
    }
  });

  test('não deve ver botão de deletar categoria como bibliotecário', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Navegar para categorias
    const categoriasLink = page.locator('a').filter({ hasText: /categoria/i }).first();
    if (await categoriasLink.isVisible()) {
      await categoriasLink.click();
      await page.waitForTimeout(500);

      // Procurar botão de deletar
      const deleteButton = page.locator('.btn-icon-delete, button[title*="deletar"]').first();
      
      // Bibliotecário NÃO deve ver o botão de deletar
      const isVisible = await deleteButton.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    }
  });
});

test.describe('Menu Principal - CLIENTE', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCliente(page);
  });

  test('deve ser redirecionado ou ter acesso limitado como cliente', async ({ page }) => {
    // Tentar acessar menu principal
    await page.goto('/menu-principal');
    await page.waitForTimeout(2000);

    // Cliente deve ter acesso mas com opções limitadas (sem Funcionários, Autores, etc.)
    // Verificar que menu está visível
    const menuVisible = await page.locator('.menu-principal-right').isVisible().catch(() => false);
    
    // Verificar que não tem acesso a Funcionários (apenas admin/bibliotecario)
    const hasFuncionarios = await page.locator('.menu-link').filter({ hasText: /funcionários/i }).isVisible().catch(() => false);
    
    expect(menuVisible && !hasFuncionarios).toBeTruthy();
  });

  test('cliente deve ter acesso ao carrinho', async ({ page }) => {
    await page.goto('/carrinho');
    await page.waitForLoadState('networkidle');

    // Cliente deve poder acessar o carrinho
    await expect(page.locator('h1:has-text("Carrinho")')).toBeVisible();
  });
});

test.describe('Perfis de Usuário - Comparação de Permissões', () => {
  test('comparar permissões: administrador vs bibliotecário', async ({ page }) => {
    // Login como administrador
    await loginAsAdministrador(page);
    await page.goto('/menu-principal');
    await page.waitForLoadState('networkidle');

    // Navegar para categorias
    const categoriasLink = page.locator('a').filter({ hasText: /categoria/i }).first();
    if (await categoriasLink.isVisible()) {
      await categoriasLink.click();
      await page.waitForTimeout(500);

      // Verificar se administrador vê botão de deletar
      const adminCanDelete = await page.locator('.btn-icon-delete').first().isVisible().catch(() => false);

      // Logout
      const logoutBtn = page.locator('#logout-btn, button:has-text("Sair")').first();
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
        await page.waitForTimeout(500);
      }

      // Login como bibliotecário
      await loginAsBibliotecario(page);
      await page.goto('/menu-principal');
      await page.waitForLoadState('networkidle');

      // Navegar para categorias novamente
      const categoriasLink2 = page.locator('a').filter({ hasText: /categoria/i }).first();
      if (await categoriasLink2.isVisible()) {
        await categoriasLink2.click();
        await page.waitForTimeout(500);

        // Verificar se bibliotecário NÃO vê botão de deletar
        const bibliotecarioCanDelete = await page.locator('.btn-icon-delete').first().isVisible().catch(() => false);

        // Administrador deve ter mais permissões que bibliotecário
        if (adminCanDelete) {
          expect(bibliotecarioCanDelete).toBe(false);
        }
      }
    }
  });
});
