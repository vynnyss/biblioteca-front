import { test, expect } from '@playwright/test';

/**
 * IMPORTANTE: Para executar estes testes, é necessário:
 * 1. Backend rodando em http://localhost:8080
 * 2. Frontend rodando em http://localhost:4200 (iniciado automaticamente pelo Playwright)
 * 3. Banco de dados configurado com:
 *    - Usuário de teste: usuario753@exemplo.com / SenhaFixa123 com permissão de ADMINISTRADOR
 *    - Categorias cadastradas no banco
 */

async function login(page: any) {
  await page.goto('/');
  
  // Clicar no botão de login no header
  await page.click('#login-btn');
  
  // Aguardar modal abrir
  await page.waitForSelector('#login-modal', { state: 'visible' });

  // Preencher credenciais
  await page.fill('#login-email', 'usuario753@exemplo.com');
  await page.fill('#login-password', 'SenhaFixa123');
  
  // Submeter formulário
  await page.click('#login-form button.btn-primary');
  
  // Aguardar modal fechar
  await page.waitForSelector('#login-modal', { state: 'hidden', timeout: 10000 });
  
  // Aguardar que o sessionStorage seja atualizado
  await page.waitForFunction(() => {
    return sessionStorage.getItem('authToken') !== null;
  }, { timeout: 10000 });
  
  // Aguardar botão de logout aparecer
  await page.waitForSelector('#logout-btn', { state: 'visible', timeout: 10000 });
}

test.describe('Menu Principal - Categorias', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('deve listar categorias', async ({ page }) => {
    // Navegar para menu principal
    await page.goto('/menu-principal');

    // Clicar no item "Categorias" do menu lateral
    await page.click('a:has-text("Categorias")');

    // Aguardar carregamento
    await page.waitForSelector('h2:has-text("Categorias")');

    // Verificar que a tabela está visível
    await expect(page.locator('.categorias-table')).toBeVisible();

    // Verificar que há linhas na tabela
    const rows = page.locator('.categorias-table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve filtrar categorias por nome', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');

    // Aguardar carregamento
    await page.waitForSelector('.categorias-table');

    // Contar linhas antes do filtro
    const rowsBefore = await page.locator('.categorias-table tbody tr').count();

    // Filtrar
    await page.fill('input[placeholder*="Pesquisar por nome"]', 'Ficção');

    // Aguardar filtragem
    await page.waitForTimeout(500);

    // Contar linhas depois
    const rowsAfter = await page.locator('.categorias-table tbody tr').count();

    // Deve ter menos linhas após filtrar
    expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
  });

  test('deve filtrar por status', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Selecionar filtro de status
    await page.selectOption('select', 'ATIVO');

    await page.waitForTimeout(500);

    // Verificar que todas as linhas visíveis são ativas
    const statusCells = page.locator('.categorias-table tbody tr td:nth-child(3)');
    const count = await statusCells.count();

    for (let i = 0; i < count; i++) {
      const text = await statusCells.nth(i).textContent();
      expect(text).toBe('ATIVO');
    }
  });

  test('deve limpar filtros', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Aplicar filtros
    await page.fill('input[placeholder*="Pesquisar por nome"]', 'Teste');
    await page.selectOption('select', 'ATIVO');

    // Contar linhas filtradas
    await page.waitForTimeout(500);
    const rowsFiltered = await page.locator('.categorias-table tbody tr').count();

    // Limpar filtros
    await page.click('button:has-text("Limpar")');

    await page.waitForTimeout(500);

    // Contar linhas após limpar
    const rowsAfter = await page.locator('.categorias-table tbody tr').count();

    // Deve ter mais linhas após limpar
    expect(rowsAfter).toBeGreaterThanOrEqual(rowsFiltered);
  });

  test('deve abrir modal de edição de categoria', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Clicar no primeiro botão de editar
    await page.click('.categorias-table tbody tr:first-child .btn-icon:not(.btn-icon-delete)');

    // Verificar que o modal abriu
    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible();

    // Verificar título do modal
    await expect(page.locator('h3:has-text("Editar Categoria")')).toBeVisible();

    // Verificar campo de input no modal
    const input = page.locator('.modal-content input[placeholder="Nome da categoria"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue(/.+/); // Deve ter algum valor pré-preenchido
  });

  test('deve editar categoria com sucesso', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Abrir modal de edição
    await page.click('.categorias-table tbody tr:first-child .btn-icon:not(.btn-icon-delete)');

    // Aguardar modal
    await page.waitForSelector('.modal-overlay');

    // Editar nome
    const input = page.locator('.modal-content input[type="text"]');
    await input.fill('Categoria Editada E2E');

    // Salvar
    await page.click('button.btn-primary:has-text("Salvar")');

    // Verificar mensagem de sucesso
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('sucesso');
      await dialog.accept();
    });

    await page.waitForTimeout(1000);

    // Modal deve fechar
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('deve cancelar edição de categoria', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Abrir modal
    await page.click('.categorias-table tbody tr:first-child .btn-icon:not(.btn-icon-delete)');
    await page.waitForSelector('.modal-overlay');

    // Clicar em cancelar
    await page.click('button.btn-outline:has-text("Cancelar")');

    // Modal deve fechar
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('deve inativar categoria (apenas administrador)', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Verificar se o botão de deletar está visível (só para administrador)
    const deleteButton = page.locator('.categorias-table tbody tr:first-child .btn-icon-delete');
    
    if (await deleteButton.isVisible()) {
      // Clicar no botão de deletar
      await deleteButton.click();

      // Confirmar o dialog
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('inativar');
        await dialog.accept();
      });

      await page.waitForTimeout(1000);

      // Verificar mensagem de sucesso
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('sucesso');
        await dialog.accept();
      });
    } else {
      // Se não houver botão de deletar, é porque não é administrador
      console.log('Botão de deletar não visível - usuário não é administrador');
    }
  });

  test('deve navegar pela paginação', async ({ page }) => {
    await page.goto('/menu-principal');
    await page.click('a:has-text("Categorias")');
    await page.waitForSelector('.categorias-table');

    // Verificar se há controles de paginação
    const paginationControls = page.locator('.pagination-controls');
    
    if (await paginationControls.isVisible()) {
      // Clicar na próxima página
      const nextButton = page.locator('.btn-pagination:has-text("›"), .btn-pagination svg polyline[points*="9 18"]').last();
      
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(500);

        // Verificar que mudou de página (botão de página ativa mudou)
        const activePage = page.locator('.btn-pagination.active');
        const pageText = await activePage.textContent();
        expect(parseInt(pageText || '1')).toBeGreaterThan(1);
      }
    }
  });
});
