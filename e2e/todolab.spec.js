import { test, expect } from '@playwright/test';

const CHAVE = 'todolab:tarefas';

// A cidade consulta a API do GitHub. Nos testes ela é simulada para o resultado não depender da rede.
function simularGitHub(page, { prs = [], issues = [] } = {}) {
  return page.route('https://api.github.com/**', (rota) => {
    const dados = rota.request().url().includes('/pulls') ? prs : issues;
    return rota.fulfill({ json: dados });
  });
}

async function adicionar(page, titulo) {
  await page.getByLabel('Nova tarefa').fill(titulo);
  await page.getByRole('button', { name: 'Adicionar' }).click();
}

test.beforeEach(async ({ page }) => {
  await simularGitHub(page);
});

test('adiciona uma tarefa e atualiza o contador (Issues #1 e #2)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');

  await adicionar(page, 'Estudar QA');

  await expect(page.locator('#todo-list li')).toHaveCount(1);
  await expect(page.locator('#todo-count')).toHaveText('1 item restante');
});

test('não cria tarefa em branco nem só com espaços (Issue #1)', async ({ page }) => {
  await page.goto('/');

  await adicionar(page, '   ');

  await expect(page.locator('#todo-list li')).toHaveCount(0);
  await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');
});

test('concluir e remover atualizam o contador (Issue #2)', async ({ page }) => {
  await page.goto('/');
  await adicionar(page, 'A');
  await adicionar(page, 'B');
  await adicionar(page, 'C');
  await expect(page.locator('#todo-count')).toHaveText('3 itens restantes');

  await page.getByLabel('Marcar A como concluída').check();
  await expect(page.locator('#todo-count')).toHaveText('2 itens restantes');

  await page.getByRole('button', { name: 'Remover B' }).click();
  await expect(page.locator('#todo-count')).toHaveText('1 item restante');
});

test('limpar concluídas remove só as concluídas e esconde o botão (Issue #4)', async ({ page }) => {
  await page.goto('/');
  await adicionar(page, 'A');
  await adicionar(page, 'B');
  await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeHidden();

  await page.getByLabel('Marcar A como concluída').check();
  await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar concluídas' }).click();

  await expect(page.locator('#todo-list li')).toHaveCount(1);
  await expect(page.locator('#todo-list li')).toContainText('B');
  await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeHidden();
});

test('as tarefas continuam depois de recarregar a página', async ({ page }) => {
  await page.goto('/');
  await adicionar(page, 'Persistente');

  await page.reload();

  await expect(page.locator('#todo-list li')).toContainText('Persistente');
  await expect(page.locator('#todo-count')).toHaveText('1 item restante');
});

test('dado corrompido no armazenamento abre a lista vazia, sem erro (Issue #3)', async ({ page }) => {
  const erros = [];
  page.on('pageerror', (erro) => erros.push(erro.message));
  page.on('console', (mensagem) => {
    if (mensagem.type() === 'error') erros.push(mensagem.text());
  });
  await page.addInitScript(([chave]) => localStorage.setItem(chave, '{abc'), [CHAVE]);

  await page.goto('/');

  await expect(page.locator('#todo-list li')).toHaveCount(0);
  await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');
  expect(erros).toEqual([]);
});

test('a cidade desenha um prédio por PR integrado e uma obra por Issue aberta (Issue #7)', async ({ page }) => {
  await page.unroute('https://api.github.com/**');
  await simularGitHub(page, {
    prs: [
      { number: 1, title: 'feat: a', merged_at: '2026-11-01T10:00:00Z' },
      { number: 2, title: 'docs: b', merged_at: '2026-11-02T10:00:00Z' },
      { number: 3, title: 'fix: fechado sem merge', merged_at: null },
    ],
    issues: [
      { number: 10, title: 'Ideia aberta' },
      { number: 11, title: 'PR aberto', pull_request: {} },
    ],
  });

  await page.goto('/');

  await expect(page.locator('#cidade-total')).toHaveText('2 prédios');
  await expect(page.locator('#cidade-canvas')).toBeVisible();
  await expect(page.locator('#cidade-lista li')).toHaveCount(3);
  await expect(page.locator('#cidade-lista li').nth(2)).toContainText('Obra: #10 Ideia aberta');
});

test('a cidade mostra erro, e não "0 prédios", quando o GitHub não responde (Issue #5)', async ({ page }) => {
  await page.unroute('https://api.github.com/**');
  await page.route('https://api.github.com/**', (rota) => rota.abort());

  await page.goto('/');

  await expect(page.locator('#cidade-mensagem')).toHaveText('Não foi possível carregar o histórico.');
  await expect(page.locator('#cidade-total')).toHaveText('');
  await expect(page.locator('#cidade-canvas')).toBeHidden();
});
