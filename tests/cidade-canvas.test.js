import test from 'node:test';
import assert from 'node:assert/strict';
import * as cidade from '../src/cidade.js';

const REPO = 'Danilo-4397/todolab-gestao-qualidade';

// Simula a API do GitHub: devolve uma resposta por tipo de consulta.
function apiSimulada({ prs = [], issues = [], falha = false, status = 200 } = {}) {
  const chamadas = [];
  const buscar = async (url) => {
    chamadas.push(url);
    if (falha) throw new TypeError('Failed to fetch');
    if (status !== 200) return { ok: false, status, json: async () => ({}) };
    const dados = url.includes('/pulls') ? prs : issues;
    return { ok: true, json: async () => dados };
  };
  return { buscar, chamadas };
}

const pr = (numero, titulo, mergedEm) => ({ number: numero, title: titulo, merged_at: mergedEm });
const issue = (numero, titulo, extra = {}) => ({ number: numero, title: titulo, ...extra });

test('Issue #7, Cenário 1 e 5: um prédio por PR integrado; abertos e sem merge ficam de fora', () => {
  const prs = [
    pr(1, 'feat: a', '2026-11-01T10:00:00Z'),
    pr(2, 'fix: b', '2026-11-02T10:00:00Z'),
    pr(3, 'docs: c', null),
    pr(4, 'test: d', '2026-11-03T10:00:00Z'),
  ];

  const plano = cidade.planejarCidade(prs, []);

  assert.equal(plano.predios.length, 3);
  assert.deepEqual(plano.predios.map((p) => p.numero), [1, 2, 4]);
});

test('Issue #7, Cenário 2: prédios da esquerda para a direita, do primeiro integrado ao último', () => {
  const prs = [
    pr(9, 'feat: tarde', '2026-11-20T10:00:00Z'),
    pr(3, 'feat: cedo', '2026-11-02T10:00:00Z'),
    pr(5, 'feat: meio', '2026-11-10T10:00:00Z'),
  ];

  const plano = cidade.planejarCidade(prs, []);

  assert.deepEqual(plano.predios.map((p) => p.numero), [3, 5, 9]);
  const xs = plano.predios.map((p) => p.x);
  assert.deepEqual(xs, [...xs].sort((a, b) => a - b));
  assert.equal(new Set(xs).size, 3);
});

test('Issue #7, Cenário 3: a cor vem do tipo do título; sem tipo conhecido usa "outro"', () => {
  assert.equal(cidade.tipoDoTitulo('feat(tasks): algo'), 'feat');
  assert.equal(cidade.tipoDoTitulo('fix: algo'), 'fix');
  assert.equal(cidade.tipoDoTitulo('docs: algo'), 'docs');
  assert.equal(cidade.tipoDoTitulo('test(tasks): algo'), 'test');
  assert.equal(cidade.tipoDoTitulo('ci: algo'), 'ci');
  assert.equal(cidade.tipoDoTitulo('Atualiza o README'), 'outro');
  assert.equal(cidade.tipoDoTitulo('feature solta sem dois pontos'), 'outro');

  const plano = cidade.planejarCidade(
    [pr(1, 'feat: a', '2026-11-01T00:00:00Z'), pr(2, 'qualquer coisa', '2026-11-02T00:00:00Z')],
    [],
  );
  assert.equal(plano.predios[0].tipo, 'feat');
  assert.equal(plano.predios[1].tipo, 'outro');
  assert.notEqual(plano.predios[0].cor, plano.predios[1].cor);
  assert.equal(cidade.CORES.feat, plano.predios[0].cor);
});

test('Issue #7, Cenário 4: cada Issue aberta é uma obra à direita dos prédios; PR aberto não conta', () => {
  const prs = [pr(1, 'feat: a', '2026-11-01T00:00:00Z')];
  const issues = [
    issue(10, 'Ideia 1'),
    issue(11, 'Ideia 2'),
    issue(12, 'PR aberto', { pull_request: { url: 'x' } }),
  ];

  const plano = cidade.planejarCidade(prs, issues);

  assert.deepEqual(plano.obras.map((o) => o.numero), [10, 11]);
  const ultimoPredio = Math.max(...plano.predios.map((p) => p.x));
  assert.ok(plano.obras.every((o) => o.x > ultimoPredio));
});

test('Issue #7, Cenário 6: o ponto sobre um prédio ou obra devolve número e título', () => {
  const plano = cidade.planejarCidade(
    [pr(1, 'feat: a', '2026-11-01T00:00:00Z')],
    [issue(10, 'Ideia 1')],
  );
  const predio = plano.predios[0];
  const obra = plano.obras[0];

  const noPredio = cidade.acharPorPonto(plano, predio.x + 2, predio.y + 2);
  const naObra = cidade.acharPorPonto(plano, obra.x + 2, obra.y + 2);

  assert.equal(noPredio.numero, 1);
  assert.equal(noPredio.titulo, 'feat: a');
  assert.equal(naObra.numero, 10);
  assert.equal(naObra.titulo, 'Ideia 1');
  assert.equal(cidade.acharPorPonto(plano, 0, 0), null);
});

test('Issue #7, Cenário 7: sem PR integrado e sem Issue aberta, cidade vazia com mensagem', async () => {
  const { buscar } = apiSimulada();

  const resultado = await cidade.carregarCidade(buscar, REPO);

  assert.equal(resultado.erro, undefined);
  assert.equal(resultado.plano.predios.length, 0);
  assert.equal(resultado.plano.obras.length, 0);
  assert.equal(resultado.mensagem, 'A cidade ainda está vazia.');
});

test('Issue #7, Cenário 8: falha de rede ou HTTP mostra o erro e nenhuma cidade', async () => {
  for (const cenario of [{ falha: true }, { status: 403 }]) {
    const { buscar } = apiSimulada(cenario);

    const resultado = await cidade.carregarCidade(buscar, REPO);

    assert.equal(resultado.mensagem, 'Não foi possível carregar o histórico.');
    assert.equal(resultado.plano, undefined);
    assert.equal(resultado.total, '');
  }
});

test('Issue #7, Cenário 9: existe alternativa em texto com o total e a lista de PRs e Issues', () => {
  const plano = cidade.planejarCidade(
    [pr(1, 'feat: primeiro', '2026-11-01T00:00:00Z'), pr(2, 'fix: segundo', '2026-11-02T00:00:00Z')],
    [issue(10, 'Ideia aberta')],
  );

  const texto = cidade.textoAlternativo(plano);

  assert.ok(texto.includes('2 prédios'));
  assert.ok(texto.includes('#1 feat: primeiro'));
  assert.ok(texto.includes('#2 fix: segundo'));
  assert.ok(texto.includes('#10 Ideia aberta'));
});

test('Issue #7: a consulta usa a API pública, PRs fechados e Issues abertas, sem autenticação', async () => {
  const { buscar, chamadas } = apiSimulada();

  await cidade.carregarCidade(buscar, REPO);

  assert.ok(chamadas.some((u) => u.includes(`/repos/${REPO}/pulls`) && u.includes('state=closed')));
  assert.ok(chamadas.some((u) => u.includes(`/repos/${REPO}/issues`) && u.includes('state=open')));
});
