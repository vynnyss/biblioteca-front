import { test, expect } from '@playwright/test';

/**
 * Testes para a página Home
 * Funcionalidades: Visualização de livros, busca, paginação, detalhes do livro
 */

test.describe('Home - Catálogo de Livros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve carregar e exibir livros na página inicial', async ({ page }) => {
    // Aguardar carregamento
    await page.waitForLoadState('networkidle');

    // Verificar que o título está presente
    await expect(page.locator('h2:has-text("Veja nosso acervo de")')).toBeVisible();

    // Verificar que os livros estão sendo exibidos
    const booksGrid = page.locator('.books-grid');
    await expect(booksGrid).toBeVisible();

    // Verificar que há pelo menos um livro
    const books = page.locator('app-book');
    const count = await books.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir contador de livros', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verificar que o contador está visível
    const booksCount = page.locator('#books-count');
    await expect(booksCount).toBeVisible();
    
    // Verificar que tem texto com "Livros encontrados"
    await expect(booksCount).toContainText('Livros encontrados');
  });

  test('deve realizar busca de livros', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Digitar no campo de busca
    const searchInput = page.locator('#search-input');
    await searchInput.fill('Dom');

    // Aguardar debounce e busca
    await page.waitForTimeout(500);

    // Verificar que o botão de limpar busca apareceu
    const clearButton = page.locator('#clear-search');
    await expect(clearButton).toBeVisible();

    // Verificar que ainda há livros exibidos
    const books = page.locator('app-book');
    const count = await books.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve limpar busca ao clicar no botão limpar', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Realizar uma busca
    const searchInput = page.locator('#search-input');
    await searchInput.fill('Teste');
    await page.waitForTimeout(500);

    // Verificar que o botão de limpar está visível
    const clearButton = page.locator('#clear-search');
    await expect(clearButton).toBeVisible();

    // Clicar no botão de limpar
    await clearButton.click();

    // Verificar que o campo de busca foi limpo
    await expect(searchInput).toHaveValue('');

    // Verificar que o botão de limpar foi escondido
    await expect(clearButton).toHaveClass(/hidden/);
  });

  test('deve navegar entre páginas usando paginação', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Verificar se há controles de paginação
    const paginationControls = page.locator('.pagination-controls');
    
    if (await paginationControls.isVisible()) {
      // Clicar no botão de próxima página
      const nextButton = page.locator('.btn-pagination').last();
      
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(500);

        // Verificar que a página mudou (URL ou conteúdo)
        const books = page.locator('app-book');
        expect(await books.count()).toBeGreaterThan(0);
      }
    }
  });

  test('deve navegar para detalhes do livro ao clicar', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Aguardar que pelo menos um livro seja carregado
    const firstBook = page.locator('app-book').first();
    await expect(firstBook).toBeVisible();

    // Clicar no botão de detalhes dentro do card
    const detailsButton = firstBook.locator('button.book-btn');
    await expect(detailsButton).toBeVisible();
    await detailsButton.click();

    // Aguardar navegação
    await page.waitForTimeout(1000);

    // Deve ter navegado para detalhes do livro
    expect(page.url()).toContain('/livros/');
  });
});

test.describe('Detalhes do Livro', () => {
  test('deve exibir informações completas do livro', async ({ page }) => {
    // Ir para home e clicar em um livro
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstBook = page.locator('app-book').first();
    await firstBook.click();
    await page.waitForTimeout(1000);

    // Verificar elementos da página de detalhes
    const bookDetails = page.locator('.book-details-section');
    if (await bookDetails.isVisible()) {
      // Verificar que há um título
      const title = page.locator('h1');
      await expect(title).toBeVisible();

      // Verificar que há descrição ou informações do livro
      const content = page.locator('.book-details-section');
      await expect(content).toBeVisible();
    }
  });

  test('deve mostrar modal de autenticação ao tentar adicionar ao carrinho sem login', async ({ page }) => {
    // Ir para home e clicar em um livro
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstBook = page.locator('app-book').first();
    await firstBook.click();
    await page.waitForTimeout(1000);

    // Procurar botão de adicionar ao carrinho
    const addToCartBtn = page.locator('button:has-text("Adicionar ao Carrinho"), button:has-text("Reservar")').first();
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);

      // Verificar que o modal de autenticação apareceu
      const authModal = page.locator('.modal-overlay');
      await expect(authModal).toBeVisible();
    }
  });
});
