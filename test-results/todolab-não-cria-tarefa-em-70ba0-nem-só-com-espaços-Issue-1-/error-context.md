# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todolab.spec.js >> não cria tarefa em branco nem só com espaços (Issue #1)
- Location: e2e/todolab.spec.js:32:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#todo-list li')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('#todo-list li') with timeout 5000ms
  - waiting for locator('#todo-list li')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e3]:
    - paragraph [ref=e4]: USJT Gestão & Qualidade
    - heading "TodoLab" [level=1] [ref=e5]
    - paragraph [ref=e6]: Código que roda ainda não é evidência de qualidade.
  - region [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]:
        - paragraph [ref=e10]: Produto em evolução
        - heading "Fila de tarefas" [level=2] [ref=e11]
      - generic "Quality gate inicial" [ref=e12]: gate 0
    - generic [ref=e14]:
      - generic [ref=e15]: Nova tarefa
      - textbox "Nova tarefa" [active] [ref=e16]:
        - /placeholder: O que precisa ser feito?
      - button "Adicionar" [ref=e17] [cursor=pointer]
    - list [ref=e18]:
      - listitem [ref=e19]:
        - checkbox "Marcar como concluída" [ref=e20]
        - button "Remover" [ref=e21] [cursor=pointer]
    - generic [ref=e22]:
      - paragraph [ref=e23]: 1 item restante
      - paragraph [ref=e24]: build 0.1 · legado inicial
  - region [ref=e25]:
    - generic [ref=e27]:
      - paragraph [ref=e28]: Cidade do Processo
      - heading "Prédios construídos" [level=2] [ref=e29]
    - generic [ref=e30]:
      - img "0 prédios e 0 em obra." [ref=e32]
      - paragraph [ref=e33]
      - list "PRs e Issues da cidade" [ref=e34]
    - generic [ref=e35]:
      - paragraph [ref=e36]: 0 prédios
      - paragraph [ref=e37]: A cidade ainda está vazia.
  - complementary [ref=e38]:
    - paragraph [ref=e39]: "01"
    - generic [ref=e40]:
      - paragraph [ref=e41]: Contrato da rodada
      - paragraph [ref=e42]: A fábrica entrega código. A equipe entrega confiança.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const CHAVE = 'todolab:tarefas';
  4   | 
  5   | // A cidade consulta a API do GitHub. Nos testes ela é simulada para o resultado não depender da rede.
  6   | function simularGitHub(page, { prs = [], issues = [] } = {}) {
  7   |   return page.route('https://api.github.com/**', (rota) => {
  8   |     const dados = rota.request().url().includes('/pulls') ? prs : issues;
  9   |     return rota.fulfill({ json: dados });
  10  |   });
  11  | }
  12  | 
  13  | async function adicionar(page, titulo) {
  14  |   await page.getByLabel('Nova tarefa').fill(titulo);
  15  |   await page.getByRole('button', { name: 'Adicionar' }).click();
  16  | }
  17  | 
  18  | test.beforeEach(async ({ page }) => {
  19  |   await simularGitHub(page);
  20  | });
  21  | 
  22  | test('adiciona uma tarefa e atualiza o contador (Issues #1 e #2)', async ({ page }) => {
  23  |   await page.goto('/');
  24  |   await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');
  25  | 
  26  |   await adicionar(page, 'Estudar QA');
  27  | 
  28  |   await expect(page.locator('#todo-list li')).toHaveCount(1);
  29  |   await expect(page.locator('#todo-count')).toHaveText('1 item restante');
  30  | });
  31  | 
  32  | test('não cria tarefa em branco nem só com espaços (Issue #1)', async ({ page }) => {
  33  |   await page.goto('/');
  34  | 
  35  |   await adicionar(page, '   ');
  36  | 
> 37  |   await expect(page.locator('#todo-list li')).toHaveCount(0);
      |                                               ^ Error: expect(locator).toHaveCount(expected) failed
  38  |   await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');
  39  | });
  40  | 
  41  | test('concluir e remover atualizam o contador (Issue #2)', async ({ page }) => {
  42  |   await page.goto('/');
  43  |   await adicionar(page, 'A');
  44  |   await adicionar(page, 'B');
  45  |   await adicionar(page, 'C');
  46  |   await expect(page.locator('#todo-count')).toHaveText('3 itens restantes');
  47  | 
  48  |   await page.getByLabel('Marcar A como concluída').check();
  49  |   await expect(page.locator('#todo-count')).toHaveText('2 itens restantes');
  50  | 
  51  |   await page.getByRole('button', { name: 'Remover B' }).click();
  52  |   await expect(page.locator('#todo-count')).toHaveText('1 item restante');
  53  | });
  54  | 
  55  | test('limpar concluídas remove só as concluídas e esconde o botão (Issue #4)', async ({ page }) => {
  56  |   await page.goto('/');
  57  |   await adicionar(page, 'A');
  58  |   await adicionar(page, 'B');
  59  |   await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeHidden();
  60  | 
  61  |   await page.getByLabel('Marcar A como concluída').check();
  62  |   await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeVisible();
  63  |   await page.getByRole('button', { name: 'Limpar concluídas' }).click();
  64  | 
  65  |   await expect(page.locator('#todo-list li')).toHaveCount(1);
  66  |   await expect(page.locator('#todo-list li')).toContainText('B');
  67  |   await expect(page.getByRole('button', { name: 'Limpar concluídas' })).toBeHidden();
  68  | });
  69  | 
  70  | test('as tarefas continuam depois de recarregar a página', async ({ page }) => {
  71  |   await page.goto('/');
  72  |   await adicionar(page, 'Persistente');
  73  | 
  74  |   await page.reload();
  75  | 
  76  |   await expect(page.locator('#todo-list li')).toContainText('Persistente');
  77  |   await expect(page.locator('#todo-count')).toHaveText('1 item restante');
  78  | });
  79  | 
  80  | test('dado corrompido no armazenamento abre a lista vazia, sem erro (Issue #3)', async ({ page }) => {
  81  |   const erros = [];
  82  |   page.on('pageerror', (erro) => erros.push(erro.message));
  83  |   page.on('console', (mensagem) => {
  84  |     if (mensagem.type() === 'error') erros.push(mensagem.text());
  85  |   });
  86  |   await page.addInitScript(([chave]) => localStorage.setItem(chave, '{abc'), [CHAVE]);
  87  | 
  88  |   await page.goto('/');
  89  | 
  90  |   await expect(page.locator('#todo-list li')).toHaveCount(0);
  91  |   await expect(page.locator('#todo-count')).toHaveText('0 itens restantes');
  92  |   expect(erros).toEqual([]);
  93  | });
  94  | 
  95  | test('a cidade desenha um prédio por PR integrado e uma obra por Issue aberta (Issue #7)', async ({ page }) => {
  96  |   await page.unroute('https://api.github.com/**');
  97  |   await simularGitHub(page, {
  98  |     prs: [
  99  |       { number: 1, title: 'feat: a', merged_at: '2026-11-01T10:00:00Z' },
  100 |       { number: 2, title: 'docs: b', merged_at: '2026-11-02T10:00:00Z' },
  101 |       { number: 3, title: 'fix: fechado sem merge', merged_at: null },
  102 |     ],
  103 |     issues: [
  104 |       { number: 10, title: 'Ideia aberta' },
  105 |       { number: 11, title: 'PR aberto', pull_request: {} },
  106 |     ],
  107 |   });
  108 | 
  109 |   await page.goto('/');
  110 | 
  111 |   await expect(page.locator('#cidade-total')).toHaveText('2 prédios');
  112 |   await expect(page.locator('#cidade-canvas')).toBeVisible();
  113 |   await expect(page.locator('#cidade-lista li')).toHaveCount(3);
  114 |   await expect(page.locator('#cidade-lista li').nth(2)).toContainText('Obra: #10 Ideia aberta');
  115 | });
  116 | 
  117 | test('a cidade mostra erro, e não "0 prédios", quando o GitHub não responde (Issue #5)', async ({ page }) => {
  118 |   await page.unroute('https://api.github.com/**');
  119 |   await page.route('https://api.github.com/**', (rota) => rota.abort());
  120 | 
  121 |   await page.goto('/');
  122 | 
  123 |   await expect(page.locator('#cidade-mensagem')).toHaveText('Não foi possível carregar o histórico.');
  124 |   await expect(page.locator('#cidade-total')).toHaveText('');
  125 |   await expect(page.locator('#cidade-canvas')).toBeHidden();
  126 | });
  127 | 
```