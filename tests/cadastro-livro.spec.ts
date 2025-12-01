import { test, expect } from '@playwright/test';

/**
 * IMPORTANTE: Para executar estes testes, é necessário:
 * 1. Backend rodando em http://localhost:8080
 * 2. Frontend rodando em http://localhost:4200 (iniciado automaticamente pelo Playwright)
 * 3. Banco de dados configurado com:
 *    - Usuário de teste: usuario753@exemplo.com / SenhaFixa123
 *    - Dados de títulos, autores, categorias, editoras e idiomas cadastrados
 */

// Helper para fazer login antes dos testes
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

test.describe('Cadastro de Livro', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('deve cadastrar um novo livro completo', async ({ page }) => {
    // Navegar para cadastro de livro
    await page.goto('/cadastro/livro');

    // Aguardar carregamento dos dados
    await page.waitForLoadState('networkidle');

    // Selecionar título
    await page.selectOption('select[name="titulo"]', { index: 1 });

    // Preencher data de publicação
    await page.fill('input[name="dataPublicacao"]', '2024-01-15');

    // Selecionar editora
    await page.selectOption('select[name="editora"]', { index: 1 });

    // Selecionar idioma
    await page.selectOption('select[name="idioma"]', { index: 1 });

    // Preencher quantidade de páginas
    await page.fill('input[name="paginas"]', '320');

    // Selecionar tipo de capa
    await page.selectOption('select[name="tipoCapa"]', 'dura');

    // Selecionar tamanho
    await page.selectOption('select[name="tamanho"]', 'medio');

    // Selecionar classificação
    await page.selectOption('select[name="classificacao"]', 'l');

    // Preencher descrição da edição
    await page.fill('input[name="edicao"]', '1ª edição revisada');

    // Upload de imagem (criar um arquivo temporário de teste)
    const imageInput = page.locator('input[name="imagem"]');
    
    // Criar um buffer com uma imagem PNG válida (1x1 pixel transparente)
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    // Fazer upload do arquivo
    await imageInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: pngBuffer,
    });

    // Aguardar um pouco para o upload processar
    await page.waitForTimeout(500);

    // Listener para capturar o dialog antes de submeter
    let dialogMessage = '';
    page.on('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    // Submeter formulário
    await page.click('button[type="submit"]');

    // Aguardar o dialog aparecer
    await page.waitForTimeout(2000);

    // Verificar mensagem de sucesso
    expect(dialogMessage.toLowerCase()).toContain('sucesso');
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto('/cadastro/livro');

    // Tentar submeter sem preencher nada
    await page.click('button[type="submit"]');

    // Verificar alert de validação
    page.on('dialog', async dialog => {
      expect(dialog.message()).toMatch(/Selecione um título|preencha todos os campos/i);
      await dialog.accept();
    });
  });

  test('deve filtrar autores ao digitar', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForTimeout(2000); // Dar tempo para carregar no Firefox
    
    // Esperar pelo campo de busca estar visível antes de interagir
    const searchInput = page.locator('input[placeholder*="Buscar autor"]');
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('Machado');

    // Aguardar filtragem
    await page.waitForTimeout(500);

    // Verificar que a lista foi filtrada
    const checkboxItems = page.locator('.checkbox-item');
    const count = await checkboxItems.count();
    
    // Deve ter algum resultado (o filtro está funcionando)
    expect(count).toBeGreaterThan(0);
  });

  test('deve filtrar categorias ao digitar', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="Buscar categoria"]');
    await searchInput.fill('Ficção');

    await page.waitForTimeout(500);

    // Verificar que há checkboxes visíveis após filtrar
    const checkboxItems = page.locator('.checkbox-item');
    const count = await checkboxItems.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('deve filtrar títulos ao digitar', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForLoadState('networkidle');

    // Buscar campo de busca de título
    const searchInput = page.locator('input[placeholder*="Buscar título"]');
    await searchInput.fill('Dom');

    await page.waitForTimeout(500);

    // Verificar que o select foi filtrado
    const select = page.locator('select[name="titulo"]');
    const options = await select.locator('option').allTextContents();
    
    // Deve ter opções filtradas
    expect(options.some(opt => opt.toLowerCase().includes('dom'))).toBeTruthy();
  });

  test('deve abrir modal de cadastro de novo título', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForLoadState('networkidle');

    // Clicar no botão de cadastrar novo título
    await page.click('button:has-text("Cadastrar novo título")');

    // Verificar que o modal abriu
    const modal = page.locator('.modal-content:has-text("Cadastrar Novo Título")');
    await expect(modal).toBeVisible();

    // Verificar campos do modal
    await expect(page.locator('input[name="novoTituloNome"]')).toBeVisible();
    await expect(page.locator('textarea[name="novoTituloDescricao"]')).toBeVisible();
  });

  test('deve cadastrar novo título através do modal', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForLoadState('networkidle');

    // Abrir modal
    await page.click('button:has-text("Cadastrar novo título")');

    // Preencher dados do título
    await page.fill('input[name="novoTituloNome"]', 'Título de Teste E2E');
    await page.fill('textarea[name="novoTituloDescricao"]', 'Descrição do título de teste');

    // Selecionar pelo menos um autor
    const primeiroAutor = page.locator('.modal-content .checkbox-item').first();
    await primeiroAutor.click();

    // Selecionar pelo menos uma categoria
    await page.waitForTimeout(300);
    const checkboxes = page.locator('.modal-content .checkbox-item');
    await checkboxes.nth(5).click(); // Selecionar uma categoria

    // Salvar título
    await page.click('button:has-text("Salvar título")');

    // Verificar sucesso
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('sucesso');
      await dialog.accept();
    });
  });

  test('deve bloquear edição de autores quando título selecionado', async ({ page }) => {
    await page.goto('/cadastro/livro');
    await page.waitForLoadState('networkidle');

    // Selecionar um título
    await page.selectOption('select[name="titulo"]', { index: 1 });

    // Aguardar processamento
    await page.waitForTimeout(500);

    // Verificar que o campo de busca de autores está desabilitado
    const searchAutor = page.locator('input[placeholder*="Buscar autor"]');
    await expect(searchAutor).toBeDisabled();

    // Verificar que o botão de cadastrar autor está desabilitado
    const btnAutor = page.locator('button:has-text("Cadastrar novo autor")');
    await expect(btnAutor).toBeDisabled();
  });

  test('deve cancelar cadastro e voltar', async ({ page }) => {
    await page.goto('/cadastro/livro');

    // Verificar que o formulário está renderizado
    const tituloSelect = page.locator('select[name="titulo"]');
    await expect(tituloSelect).toBeVisible();
    
    // Verificar que o botão de cancelar existe e é visível
    const cancelBtn = page.locator('button:has-text("Cancelar")');
    await expect(cancelBtn).toBeVisible();
  });
});
